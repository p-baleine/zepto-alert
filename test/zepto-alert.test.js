
describe("zepto-alert", function() {
  var $ = require("p-baleine-zepto"),
      Emitter = require("component-emitter"),
      alert = require("zepto-alert");

  it("should be a function", function() {
    expect(alert).to.be.a("function");
  });

  it("should export Alert", function() {
    expect(alert.Alert).to.be.an("function");
  });

  it("should return an instance of Alert", function() {
    expect(alert()).to.be.an(alert.Alert);
  });

  it("should proxy title to Alert", function() {
    var title = "mytitle",
        alertObj = alert(title);
    expect(alertObj).to.have.property("title", title);
  });

  it("should proxy message to Alert", function() {
    var message = "mymessage",
        alertObj = alert("", message);
    expect(alertObj).to.have.property("message", message);
  });

  describe("Alert", function() {
    beforeEach(function() {
      this.alert = new alert.Alert();
    });

    afterEach(function() {
      $("#zepto-alert,#overlay").remove();
    });

    it("should inherit Emitter", function() {
      expect(this.alert).to.be.a(Emitter);
    });

    it("should implement `#show()`", function() {
      expect(this.alert.show).to.be.a("function");
    });

    describe("#show()", function() {
      beforeEach(function() {
        this.spy = sinon.spy();
        this.alert.on("show", this.spy);
      });

      it("should emit `show`", function() {
        this.alert.show();
        expect(this.spy.called).to.be.ok();
      });

      it("should display alert element with `zepto-alert` id", function() {
        this.alert.show();
        expect($("#zepto-alert")).to.not.be.empty();
      });

      it("should display alert element with overlay", function() {
        this.alert.show();
        expect($("#overlay")).to.not.be.empty();
      });

      it("should display title", function() {
        this.alert = new alert.Alert({ title: "hoge" });
        this.alert.show();
        expect($("#zepto-alert").html()).to.match(/hoge/);
      });

      it("should display message", function() {
        this.alert = new alert.Alert({ message: "piyo" });
        this.alert.show();
        expect($("#zepto-alert").html()).to.match(/piyo/);
      });

      it("should display ok button", function() {
        this.alert.show();
        expect($("#zepto-alert").html()).to.match(/OK/);        
      });
    });

    describe("#hide()", function() {
      beforeEach(function() {
        this.alert.show();
        this.spy = sinon.spy();
        this.alert.on("hide", this.spy);
        this.alert.hide();
      });

      it("should remove element", function() {
        expect($("#zepto-alert").closest('html')).to.empty();
      });

      it("should emit `hide`", function() {
        expect(this.spy.called).to.be.ok();
      });
    });

    describe("click OK", function() {
      beforeEach(function() {
        this.hideSpy = sinon.spy(this.alert, "hide");
        this.alert.show();
        click($("#zepto-alert .zepto-alert-ok"));
      });

      afterEach(function() {
        this.alert.hide.restore();
      });

      it("should call hide", function() {
        expect(this.hideSpy.called).to.be.ok();
      });
    });
  });
});

function click(el){
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('click', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
  $(el).get(0).dispatchEvent(event);
}
