import { Button, Table, Avatar } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const columns = [
  { title: '头像', dataIndex: 'avatar', key: 'avatar', render: () => <Avatar /> },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '联系方式', dataIndex: 'contact', key: 'contact' },
  { title: '操作', key: 'action', render: () => <a>查看</a> },
]

const data: any[] = []

function CastList() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>演员管理</h1>
        <Button type="primary" icon={<PlusOutlined />}>添加演员</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default CastList
