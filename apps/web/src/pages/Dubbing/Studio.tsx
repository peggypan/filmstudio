import { Button, Card, Select, Input, Space } from 'antd'
import { AudioOutlined, PlayCircleOutlined } from '@ant-design/icons'

const { TextArea } = Input

function DubbingStudio() {
  return (
    <div>
      <h1>配音合成</h1>
      <Card title="配音设置">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select placeholder="选择音色" style={{ width: 200 }}>
            <Select.Option value="male">男声</Select.Option>
            <Select.Option value="female">女声</Select.Option>
          </Select>
          <TextArea rows={6} placeholder="输入要合成的文本..." />
          <Button type="primary" icon={<AudioOutlined />}>生成配音</Button>
        </Space>
      </Card>
    </div>
  )
}

export default DubbingStudio
