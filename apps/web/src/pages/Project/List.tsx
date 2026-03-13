import { Button, Table, Tag, Progress } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const columns = [
  { title: '项目名称', dataIndex: 'name', key: 'name' },
  { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="blue">{status}</Tag> },
  { title: '进度', dataIndex: 'progress', key: 'progress', render: (progress: number) => <Progress percent={progress} size="small" /> },
  { title: '负责人', dataIndex: 'owner', key: 'owner' },
  { title: '操作', key: 'action', render: () => <a>查看详情</a> },
]

const data = [
  { key: '1', name: '项目A', status: '进行中', progress: 65, owner: '张三' },
]

function ProjectList() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>项目管理</h1>
        <Button type="primary" icon={<PlusOutlined />}>新建项目</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default ProjectList
