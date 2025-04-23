import Revolver from '@/components/Revolver'

export default async function Page() {
  return (
    <>
      <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        {/* TODO: add webgl background */}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
        {/* TODO: add typewriter effect */}
        Explore the world with curiosity and creativity. ...... <br /> Fine! with AI(❤️) too
      </div>
      {/* TODO: add revolver menu */}
      <Revolver />
    </>
  )
}
