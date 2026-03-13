import { Button, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const columns = [
  { title: '剧本名称', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="blue">{status}</Tag> },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
  { title: '操作', key: 'action', render: () => <Link to="/scripts/1">编辑</Link> },
]

const data = [
  { key: '1', name: '项目A剧本', type: '短视频', status: '进行中', updatedAt: '2026-03-13' },
]

function ScriptList() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>剧本管理</h1>
        <Button type="primary" icon={<PlusOutlined />}>新建剧本</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default ScriptList
