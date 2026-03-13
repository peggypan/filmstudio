import { Button, Card, Row, Col } from 'antd'
import { PlusOutlined, ThunderboltOutlined } from '@ant-design/icons'

function StoryboardEditor() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>分镜设计</h1>
        <Button type="primary" icon={<ThunderboltOutlined />}>AI生成分镜</Button>
      </div>
      <Row gutter={16}>
        <Col span={6}>
          <Card title="镜头 1" extra={<Button size="small" icon={<PlusOutlined />}>编辑</Button>}>
            <div style={{ height: 150, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              分镜图
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default StoryboardEditor
