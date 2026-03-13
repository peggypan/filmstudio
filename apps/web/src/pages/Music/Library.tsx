import { Button, Table, Tag } from 'antd'
import { PlusOutlined, PlayCircleOutlined } from '@ant-design/icons'

const columns = [
  { title: '音乐名称', dataIndex: 'name', key: 'name' },
  { title: '风格', dataIndex: 'style', key: 'style' },
  { title: '时长', dataIndex: 'duration', key: 'duration' },
  { title: '版权', dataIndex: 'license', key: 'license', render: (license: string) => <Tag>{license}</Tag> },
  { title: '操作', key: 'action', render: () => <PlayCircleOutlined style={{ fontSize: 20, cursor: 'pointer' }} /> },
]

const data: any[] = []

function MusicLibrary() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>配乐管理</h1>
        <Button type="primary" icon={<PlusOutlined />}>上传音乐</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default MusicLibrary
