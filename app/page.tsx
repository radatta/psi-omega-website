import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "@radix-ui/react-icons"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-background.jpg"
            alt="Alpha Kappa Psi Brotherhood"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">SHAPING PEOPLE, SHAPING BUSINESS</h1>
          <h3 className="text-xl md:text-2xl mb-8">
            Alpha Kappa Psi is recognized as the premier developer of principled business leaders.
          </h3>
          <Button asChild className="bg-white text-black hover:bg-gray-200 hover:text-black">
            <Link href="/about-akpsi">Learn more</Link>
          </Button>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-sm mb-2">Scroll</div>
          <ChevronDownIcon className="mx-auto animate-bounce" />
        </div>
      </section>

      {/* President Letter Section */}
      <section id="letter-president" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image src="/images/president.jpg" alt="Chapter President" fill className="object-cover rounded-md" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">A LETTER FROM OUR PRESIDENT</h1>
              <p className="mb-4">
                On behalf of Santa Clara University's Psi Omega Chapter, I would like to welcome you to our fraternity's
                website. Our platform offers insight into our chapter's identity while also providing you with
                information about our extensive network and guiding goals.
              </p>
              <p className="mb-4">
                In essence, Alpha Kappa Psi is a diverse group of distinct, motivated, and insightful individuals from
                all around the world. Every member of the Psi Omega chapter is constantly striving to grow
                professionally and personally, supporting each other in all of their endeavors. Each brother offers a
                unique perspective and set of skills that make our chapter the perfect place for growth and development.
              </p>
              <p className="mb-4">
                I became a member of Alpha Kappa Psi during my freshman year at SCU, and since then, this group of
                people and being a part of this fraternity has genuinely been life-changing. I have made all of my
                closest friends and built a support system I can rely on for life. Words truly cannot express how
                grateful I am for the last three years that I have been a part of this community, and I am so lucky to
                be able to guide this talented and caring group in the upcoming academic year. Alpha Kappa Psi has
                shaped my college experience, and I look forward to giving back to this outstanding organization.
              </p>
              <div className="text-right">
                <p>Sincerely,</p>
                <p>Avery Pierson</p>
                <p className="italic">President, Psi Omega Chapter</p>
                <p className="italic">Santa Clara University '25</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is AKPsi Section */}
      <section id="what-is-akpsi" className="py-16 bg-gray-100 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">WHAT IS ALPHA KAPPA PSI?</h1>
            <h3 className="text-xl mb-6">
              Alpha Kappa Psi is the nation's oldest and largest co-ed business fraternity. Since our founding in 1904,
              we have grown to 298,000 initiated members, 219 active chapters in 4 different countries.
            </h3>
            <h3 className="text-xl mb-8">
              The Psi Omega chapter was founded at Santa Clara University in 2005 and includes over 60 active brothers
              across the College of Arts & Sciences, Leavey School of Business, and School of Engineering — making us
              the only professional business fraternity on campus to accept all majors.
            </h3>
            <Button asChild>
              <Link href="/about-akpsi">Learn more</Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/brotherhood.jpg" alt="Brotherhood" fill className="object-cover" />
        </div>
      </section>

      {/* Rush Section */}
      <section id="rush-akpsi" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">RUSH AKPSI</h1>
          <h3 className="text-xl max-w-3xl mx-auto mb-8">
            Take a chance and learn more about Alpha Kappa Psi and how we can help you invest in your future and enhance
            your college experience.
          </h3>
          <Button asChild>
            <Link href="/rush-akpsi">RUSH AKPSI</Link>
          </Button>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="py-16 bg-gray-100 relative">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/group-photo.jpg" alt="Group Photo" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center">THANK YOU TO OUR SPONSORS!</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 flex items-center justify-center mb-4">
                <Image src="/images/kpmg-logo.png" alt="KPMG" width={150} height={150} className="object-contain" />
              </div>
              <h3 className="text-xl font-bold">
                <a href="https://kpmg.com/xx/en/careers.html" target="_blank" rel="noopener noreferrer">
                  KPMG
                </a>
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 flex items-center justify-center mb-4">
                <Image src="/images/ey-logo.png" alt="EY" width={150} height={150} className="object-contain" />
              </div>
              <h3 className="text-xl font-bold">
                <a href="https://www.ey.com/en_us/careers" target="_blank" rel="noopener noreferrer">
                  EY
                </a>
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 flex items-center justify-center mb-4">
                <Image
                  src="/images/deloitte-logo.png"
                  alt="Deloitte"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">
                <a
                  href="https://www2.deloitte.com/us/en/careers/careers.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Deloitte
                </a>
              </h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
