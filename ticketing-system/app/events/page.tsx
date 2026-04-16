import Status from './components/Status'
import Events from './components/Events'
import { getallEvents } from '../services/event-service'

export default async function Page() {
  const events = await getallEvents()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        
        {/* Header Section: Now with internal spacing */}
        <div className="flex flex-col gap-6 mb-16"> 
          <Status />
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-[0.9]">
              Explore <span className="text-blue-600">Events.</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl font-medium">
              High-concurrency ticketing for the world's most anticipated moments. 
              Grab your spot before they vanish.
            </p>
          </div>
        </div>

        {/* Events Grid Wrapper */}
        <section className="relative border-t border-gray-100 pt-12">
          <Events initialEvents={events} />
        </section>
      </div>
    </div>
  )
}