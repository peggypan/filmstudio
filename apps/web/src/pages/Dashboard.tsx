import { Card, Row, Col, Statistic } from 'antd'
import { FileTextOutlined, TeamOutlined, ProjectOutlined, ClockCircleOutlined } from '@ant-design/icons'

function Dashboard() {
  return (
    <div>
      <h1>工作台</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="进行中的项目" value={5} prefix={<ProjectOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="剧本数量" value={12} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="演员库" value={48} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待办任务" value={8} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
