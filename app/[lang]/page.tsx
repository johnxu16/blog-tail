import Revolver from '@/components/Revolver'
import VimMenu from '@/components/VimMenu'

const items = [{ label: 'Option 1' }, { label: 'Option 2' }, { label: 'Option 3' }]

export default async function Page() {
  return (
    <>
      <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        {/* TODO: add webgl background */}
      </div>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-4 text-4xl">
        {/* TODO: add typewriter effect */}
        <div>Explore the world with curiosity and creativity. ......</div>
        <div>Fine! with ❤️ too</div>
        <div>
          {/* TODO: add retro-game style text with background glitched text */}
          <VimMenu items={items} />
        </div>
      </div>
      {/* TODO: add revolver menu */}
      <Revolver />
    </>
  )
}
