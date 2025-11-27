import Link from "next/link"
import { ArrowRightIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight text-balance text-foreground">
                Protect Forests with AI
              </h1>
              <p className="text-xl text-muted-foreground text-balance leading-relaxed">
                Advanced wildfire detection and monitoring powered by artificial intelligence. Real-time protection for
                our planet's most vital ecosystems.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/upload">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Upload Image
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Open Dashboard
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-border">
              {[
                { label: "Detection Accuracy", value: "98.5%" },
                { label: "Response Time", value: "<2s" },
                { label: "Coverage Area", value: "Global" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Minimal and Clean */}
          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl" />
            <div className="relative h-full rounded-3xl border border-border bg-card/50 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <div className="space-y-6 text-center px-8">
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20" />
                </div>
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-foreground">Real-time Detection</p>
                  <p className="text-sm text-muted-foreground">Satellite and drone imagery analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6 text-foreground">Why Choose iFire?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powered by YOLOv8 object detection and advanced machine learning
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Early Detection",
              description: "Identify fires at their earliest stages before they spread",
              number: "01",
            },
            {
              title: "Real-time Monitoring",
              description: "Continuous surveillance of high-risk forest areas",
              number: "02",
            },
            {
              title: "Risk Prediction",
              description: "Predict fire risk based on weather and environmental data",
              number: "03",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl font-bold text-primary/20 mb-6">{feature.number}</div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
