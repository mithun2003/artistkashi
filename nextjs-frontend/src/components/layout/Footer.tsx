import Link from 'next/link'

export function Footer () {
  return (
    <footer className='border-t border-[#2A2A2A] mt-40'>
      <div className='max-w-[1440px] mx-auto px-8 lg:px-16 py-20 grid grid-cols-1 md:grid-cols-4 gap-12'>
        <div className='md:col-span-1'>
          <div className='mb-6'>
            <div
              className='text-[#F5F5F5] text-2xl font-extrabold tracking-[0.1em] uppercase'
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Artist
            </div>
            <div className='text-[#B89D5C] text-[10px] font-mono tracking-[0.25em] uppercase'>
              Kashi
            </div>
          </div>
          <p className='text-[#8B8B8B] text-sm leading-relaxed'>
            A premium destination for serious collectors and students of the
            painted world.
          </p>
          <div className='flex gap-4 mt-6'>
            {['IG', 'TW', 'YT'].map(s => (
              <button
                key={s}
                className='w-10 h-10 border border-[#2A2A2A] flex items-center justify-center text-[11px] font-mono text-[#8B8B8B] hover:border-[#886e31] hover:text-[#B89D5C] transition-colors'
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {[
          {
            title: 'Learn',
            links: [
              { label: 'All Courses', href: '/courses' },
              { label: 'Course Detail', href: '/courses/1' },
              { label: 'Lesson Player', href: '/lesson-player' }
            ]
          },
          {
            title: 'Collect',
            links: [
              { label: 'Shop', href: '/shop' },
              { label: 'Original Works', href: '/shop/1' },
              { label: 'Commissions', href: '/shop' }
            ]
          },
          {
            title: 'Platform',
            links: [
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Instructor', href: '/admin' },
              { label: 'Home', href: '/' }
            ]
          }
        ].map(col => (
          <div key={col.title}>
            <div className='text-[11px] tracking-[0.2em] uppercase font-mono text-[#B89D5C] mb-6'>
              {col.title}
            </div>
            <div className='flex flex-col gap-3'>
              {col.links.map(l => (
                <Link
                  key={l.label}
                  href={l.href}
                  className='text-[#8B8B8B] hover:text-[#F5F5F5] text-sm text-left transition-colors'
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className='border-t border-[#2A2A2A]'>
        <div className='max-w-[1440px] mx-auto px-8 lg:px-16 py-6 flex flex-col sm:flex-row justify-between items-center gap-4'>
          <p className='text-[#8B8B8B] text-[12px] font-mono'>
            © 2026 Artist Kashi. All rights reserved.
          </p>
          <p className='text-[#8B8B8B] text-[12px] font-mono'>
            Crafted with intention.
          </p>
        </div>
      </div>
    </footer>
  )
}
