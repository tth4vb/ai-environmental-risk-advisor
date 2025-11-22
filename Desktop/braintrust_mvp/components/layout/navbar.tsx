import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            🧠 Braintrust
          </Link>
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link href="/search">Search</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/browse">Browse</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/map">Knowledge Map</Link>
            </Button>
            <Button asChild>
              <Link href="/add">Add to Braintrust</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
