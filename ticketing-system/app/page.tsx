import Cta from "./_landing/_components/Cta"
import Features from "./_landing/_components/Features"
import Hero from "./_landing/_components/Hero"
import Stats from "./_landing/_components/Stats"

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