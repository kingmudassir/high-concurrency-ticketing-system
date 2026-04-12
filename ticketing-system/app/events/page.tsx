import Status from './components/Status'
import Events from './components/Events'
import { getallEvents } from '../services/event-service'

export default async function page() {
  const events = await getallEvents()

  return (
    <div className='px-10 mt-20'>
      <Status />
      <Events initialEvents={events} />
    </div>
  )
}