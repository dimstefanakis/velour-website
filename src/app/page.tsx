'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from 'sonner'
import { addToWaitlist } from '@/app/actions/waitlist'
import { generateEventId } from '@/lib/facebook-conversions'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    
    // Generate event ID for deduplication
    const eventId = generateEventId()
    
    try {
      const result = await addToWaitlist({ 
        email,
        eventId,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : undefined
      })

      if (result.success) {
        toast.success("Welcome to the waitlist! We'll notify you when we launch.")
        
        // Track Meta Pixel Lead event with same event ID for deduplication
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Lead', {
            content_name: 'Email Waitlist',
            email: email,
          }, {
            eventID: eventId
          })
        }
        
        setEmail('')
      } else {
        toast.error(result.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-hero opacity-60"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 text-balance">
            Your Next Secret Obsession
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Bite-sized romance stories you can listen to anywhere, anytime.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              className="flex-1 bg-background border-accent focus:ring-accent h-14 text-lg p-5 md:px-6"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 h-14 text-lg font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
            </Button>
          </form>
        </div>
      </section>

      {/* Emotional Hook */}
      <section className="px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-card"></div>
        <div className="absolute inset-0 mesh-gradient-intimate opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <blockquote className="font-playfair text-2xl md:text-3xl lg:text-4xl text-primary mb-6 italic text-balance">
            &ldquo;90 seconds is all it takes to fall into a new romance&hellip;&rdquo;
          </blockquote>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Slip away into a world of whispered secrets, stolen moments, and irresistible drama. Perfect for when you
            only have a minute—but crave a story that lingers.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-soft opacity-40"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg bg-card/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🎧</div>
                <h3 className="font-playfair text-xl font-semibold text-primary mb-2">
                  Listen to short romance stories
                </h3>
                <p className="text-muted-foreground text-pretty">
                  Immersive audio dramas crafted for your busy lifestyle
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg bg-card/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">💌</div>
                <h3 className="font-playfair text-xl font-semibold text-primary mb-2">
                  Get hooked by irresistible cliffhangers
                </h3>
                <p className="text-muted-foreground text-pretty">Every episode leaves you wanting more</p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg bg-card/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🔮</div>
                <h3 className="font-playfair text-xl font-semibold text-primary mb-2">
                  Shape where the drama goes next
                </h3>
                <p className="text-muted-foreground text-pretty">Your choices influence the story&apos;s direction</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-card"></div>
        <div className="absolute inset-0 mesh-gradient-blush opacity-40"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <blockquote className="italic text-muted-foreground text-lg">
              &ldquo;It feels like someone&apos;s telling me a secret.&rdquo;
            </blockquote>
            <blockquote className="italic text-muted-foreground text-lg">&ldquo;Finally, drama made just for me.&rdquo;</blockquote>
            <blockquote className="italic text-muted-foreground text-lg">
              &ldquo;The perfect escape, even on my busiest days.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-warm opacity-50"></div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-8 text-balance">
            Be the first to know when the story begins.
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              className="flex-1 bg-background border-accent focus:ring-accent h-14 text-lg px-5 md:px-6"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 h-14 text-lg font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground italic">No spam. Just stories.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-intimate opacity-20"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="font-playfair text-2xl font-bold mb-4">Secret Obsession</div>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
