import Cta from "./_components/Cta"
import Features from "./_components/Features"
import Hero from "./_components/Hero"
import Stats from "./_components/Stats"

export default async function page() {
  return (
    <div className="">
      <Hero />
      <Stats />
      <Features />
      <Cta />
    </div>
  )
}