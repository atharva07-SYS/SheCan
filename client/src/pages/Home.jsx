import { useEffect } from 'react'
import Hero from '../components/sections/Hero'
import Mission from '../components/sections/Mission'
import Stats from '../components/sections/Stats'
import Testimonials from '../components/sections/Testimonials'
import FAQ from '../components/sections/FAQ'
import ContactInfo from '../components/sections/ContactInfo'

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Hero />
      <Mission />
      <Stats />
      <Testimonials />
      <FAQ />
      <ContactInfo />
    </>
  )
}
