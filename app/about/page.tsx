import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 text-foreground">About iFire</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Leveraging artificial intelligence to detect, monitor, and predict forest fires for environmental protection
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              iFire is dedicated to enabling early detection and prevention of forest fires through cutting-edge
              artificial intelligence. We believe that technology can play a crucial role in protecting our planet's
              forests and the communities that depend on them.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              By combining satellite imagery, drone footage, and CCTV data with advanced machine learning models, we
              provide real-time fire detection and risk prediction capabilities that help authorities respond faster and
              more effectively to potential threats.
            </p>
          </div>
          <Card className="p-8 bg-card border-border">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Early Detection</h3>
                <p className="text-sm text-muted-foreground">Identify fires at their earliest stages</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Real-time Response</h3>
                <p className="text-sm text-muted-foreground">Enable faster emergency response</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Global Coverage</h3>
                <p className="text-sm text-muted-foreground">Monitor forests worldwide</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Technology Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Our Technology</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 border-border bg-card">
            <h3 className="text-2xl font-bold mb-4 text-foreground">AI Model: YOLOv8</h3>
            <p className="text-muted-foreground mb-4">
              We utilize YOLOv8 (You Only Look Once v8), a state-of-the-art object detection model that excels at
              identifying fire and smoke patterns in real-time.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Real-time detection with minimal latency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>High accuracy in diverse environmental conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Optimized for edge deployment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Continuous learning and improvement</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 border-border bg-card">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Data Sources</h3>
            <p className="text-muted-foreground mb-4">
              iFire integrates data from multiple sources to provide comprehensive fire detection and monitoring
              capabilities.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Satellite imagery for large-scale monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Drone footage for detailed analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>CCTV feeds from monitoring stations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Weather and environmental data integration</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Fire Detection",
              description: "Automatically detect fire and smoke in images and video streams with high accuracy",
            },
            {
              title: "Risk Prediction",
              description: "Predict fire risk based on temperature, humidity, rainfall, and vegetation density",
            },
            {
              title: "Dashboard Monitoring",
              description: "Real-time visualization of detected hotspots on an interactive global map",
            },
            {
              title: "Fast Response",
              description: "Sub-2 second detection time enables rapid emergency response",
            },
            {
              title: "Global Coverage",
              description: "Monitor forests and peatlands across the entire globe",
            },
            {
              title: "Responsive Design",
              description: "Access iFire from any device with a modern web browser",
            },
          ].map((feature) => (
            <Card key={feature.title} className="p-6 border-border bg-card hover:border-primary/50 transition-colors">
              <h3 className="font-bold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Our Team</h2>
        <Card className="p-8 bg-card border-border">
          <p className="text-lg text-muted-foreground text-center mb-6">
            iFire is developed by a dedicated team of AI researchers, environmental scientists, and software engineers
            passionate about using technology to protect our planet.
          </p>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { role: "AI Research", count: "5+" },
              { role: "Environmental Science", count: "3+" },
              { role: "Software Engineering", count: "4+" },
              { role: "Data Science", count: "3+" },
            ].map((member) => (
              <div key={member.role}>
                <p className="text-3xl font-bold text-primary mb-2">{member.count}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Impact Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Our Impact</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { stat: "50M+", label: "Hectares Monitored" },
            { stat: "98.5%", label: "Detection Accuracy" },
            { stat: "2s", label: "Average Response Time" },
          ].map((impact) => (
            <Card key={impact.label} className="p-8 text-center bg-card border-border">
              <p className="text-4xl font-bold text-primary mb-2">{impact.stat}</p>
              <p className="text-muted-foreground">{impact.label}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
