import Image from "next/image"

export default function ValuesSection() {
  return (
    <section id="values" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">OUR VALUES</h1>
            <hr className="border-gray-300 mb-8" />
          </div>
          <div className="md:col-span-1"></div>
        </div>

        <div className="mt-8">
          <div className="relative h-32 md:h-36 w-full">
            <Image src="/images/values-icons.jpg" alt="Alpha Kappa Psi Values" fill className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  )
}
