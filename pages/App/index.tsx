'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Form, Input,message } from 'antd';
import { bitable } from '@base-open/connector-api';
import { useRouter } from 'next/router';
import style from "./index.module.css";
const { TextArea } = Input;
export default function App() {
  let router = useRouter();
  const [messageApi,contextHolder] = message.useMessage();
  const [value, setValue] = useState();
  const [userId, setUserId] = useState();
  const [tenantKey, setTenantKey] = useState();
  const [step,setStep] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    bitable.getConfig().then(config => {
      console.log('srcTablePath client', config);
      setValue(config?.value || '');
    });
    bitable.getUserId().then(id => {
      setUserId(id);
    });
    bitable.getTenantKey().then(key => {
      setTenantKey(key);
    })
  }, [])

  const [basic,setBasic]=useState({})
  const onNext = async (values: any) => {
    try{
      setLoading(true)
      let res = await fetch("/api/connect",{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values),
      })
      const status = res.status;
      let data = await res.json()
      if(status >= 400){
        const message = data?.message.status >= 500?data.message.routine||'连接数据库错误':data.message
          messageApi.open({
          type: 'error',
          content:message ,
        })
      }else{
        setBasic(values)
        setStep(2)
      }
    }catch(error:any){
      messageApi.open({
        type: 'error',
        content: error,
      });
    }finally{
      setLoading(false)
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  interface IInfo{sql:string,template:string,tableName:string}
  const onFinish = (info:IInfo)=>{
    bitable.saveConfigAndGoNext({ value:basic,sql:info.sql,template:info.template,tableName:info.tableName,key: userId })
  }
  return (
    <div className="box">
       {contextHolder}
      {
        step === 1?
        (
          <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onNext}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            extra="请填写公网数据库地址"
            label="数据库地址"
            name="host"
            rules={[{ required: true, message: '请输入数据库地址!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            extra="示例：5432，请填写数据库端口。"
            label="端口"
            name="port"
            rules={[{ required: true, message: '请输入端口!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            extra="请填写数据库名称。"
            label="数据库名称"
            name="dbname"
            rules={[{ required: true, message: '请输入数据库名称!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            extra="请填写用户名，建议创建一个具有有限权限的数据库用户。"
            label="用户名"
            name="user"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            extra="请填写密码，建议使用复杂密码。"
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item span={24}>
            <Button loading={loading} style={{width:'100%'}} type="primary" htmlType="submit">
              下一步
            </Button>
          </Form.Item>
        </Form>):(<Form
          name="sql"
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            extra="请输入数据表名称"
            label="数据表名称"
            name="tableName"
          >
            <Input />
          </Form.Item>
          <Form.Item
            extra="请输入sql语句"
            label="sql语句"
            name="sql"
            rules={[{ required: true, message: '请输入sql语句!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            extra='请输入模版json数据格式为[{"fieldId":"name","fieldName":"姓名","fieldType":1,"isPrimary":false,"description":"这是描述","property":{}}]'
            label="模版json"
            name="template"
            rules={[{ required: true, message: '请输入sql语句!' }]}
          >
             <TextArea />
          </Form.Item>
          <Form.Item>
            <div className={style.submitBtn}>
              <Button style={{width:'30%'}} type="primary" htmlType="submit">
                下一步
              </Button>
              <Button style={{width:'30%'}} type="primary" onClick={()=>{setStep(1)}} >
                上一步
              </Button>
            </div>
          </Form.Item>
          </Form>)
      }


    </div>
  )
}