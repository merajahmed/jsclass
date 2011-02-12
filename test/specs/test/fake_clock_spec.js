JS.ENV.Test = JS.ENV.Test || {}

JS.ENV.Test.FakeClockSpec = JS.Test.describe(JS.Test.FakeClock, function() {
  include(JS.Test.FakeClock)
  
  before(function() { clock.stub() })
  after(function() { clock.reset() })
  
  describe("setTimeout", function() {
    before(function() {
      this.calls = 0
      this.timer = JS.ENV.setTimeout(function() { calls += 1 }, 1000)
    })
    
    it("runs the timeout after clock has ticked enough", function() {
      clock.tick(1000)
      assertEqual( 1, calls )
    })
    
    it("runs the timeout after time has accumulated", function() {
      clock.tick(500)
      assertEqual( 0, calls )
      clock.tick(500)
      assertEqual( 1, calls )
    })
    
    it("only runs the timeout once", function() {
      clock.tick(1500)
      assertEqual( 1, calls )
      clock.tick(1500)
      assertEqual( 1, calls )
    })
    
    it("does not run the callback if it is cleared", function() {
      clearTimeout(timer)
      clock.tick(1000)
      assertEqual( 0, calls )
    })
  })
  
  describe("setInterval", function() {
    before(function() {
      this.calls = 0
      this.timer = setInterval(function() { calls += 1 }, 1000)
    })
    
    it("runs the timeout after clock has ticked enough", function() {
      clock.tick(1000)
      assertEqual( 1, calls )
    })
    
    it("runs the timeout after time has accumulated", function() {
      clock.tick(500)
      assertEqual( 0, calls )
      clock.tick(500)
      assertEqual( 1, calls )
    })
    
    it("runs the timeout repeatedly", function() {
      clock.tick(1500)
      assertEqual( 1, calls )
      clock.tick(1500)
      assertEqual( 3, calls )
    })
    
    it("does not run the callback if it is cleared", function() {
      clearInterval(timer)
      clock.tick(1000)
      assertEqual( 0, calls )
    })
  })
  
  describe("with interleaved calls", function() {
    before(function() {
      this.calls = []
      
      JS.ENV.setTimeout(function() {
        JS.ENV.setTimeout(function() { calls.push("third") }, 100)
        calls.push("first")
      }, 50)
      
      JS.ENV.setTimeout(function() { calls.push("second") }, 50)
      
      setInterval(function() { calls.push("ping") }, 40)
    })
    
    it("schedules chains of functions correctly", function() {
      clock.tick(150)
      assertEqual( ["ping", "first", "second", "ping", "ping", "third"], calls )
    })
  })

  describe(Date, function() {
    before(function() {
      this.a = this.b = null
      JS.ENV.setTimeout(function() { b = new Date().getTime() }, 100)
      a = new Date().getTime()
    })
    
    it("mirrors the fake time", function() {
      clock.tick(200)
      assertEqual( 100, b - a )
    })
  })
})  