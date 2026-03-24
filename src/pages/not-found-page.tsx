import { Result } from 'antd'
import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <section className="page-section">
      <Result status="404" title="404" subTitle="Page not found." extra={<Link to="/">Back home</Link>} />
    </section>
  )
}
