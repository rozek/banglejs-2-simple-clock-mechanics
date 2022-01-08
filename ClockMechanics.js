(function () {
  exports.windUp = function windUp (Options, Settings) {
    Options  = Options  || {};
    Settings = Settings || {};

    let ClockSize     = Options.size  || require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clock-size/main/ClockSize.js');
    let Background    = Options.background || undefined;
    let ClockFace     = Options.face  || require('https://raw.githubusercontent.com/rozek/banglejs-2-no-clock-face/main/ClockFace.js');
    let ClockHands    = Options.hands || require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clock-hands/main/ClockHands.js');
    let Complications = Options.complications || undefined;

    Settings = Object.assign(Settings, {
       Foreground:'Theme', Background:'Theme', Seconds:'#FFFF00'
    });

    Bangle.loadWidgets();

    let CenterX = ClockSize.CenterX();
    let CenterY = ClockSize.CenterY();

    let outerRadius = ClockSize.outerRadius();

    let Timer;
    function refreshDisplay () {
      g.reset();
      if (Background == null) {
        g.clear();
      } else {
        Background.draw();
      }

      Bangle.drawWidgets();

      ClockFace.draw(Settings, CenterX,CenterY, outerRadius);

      if (Complications != null) {
        let Radius = outerRadius * 0.4;

        let sin30 = 0.5;
        let sin60 = 0.866;

        if (Complications.t != null) {
          Complications.t.draw(CenterX,CenterY-sin60*Radius);
        } else {
          if (Complications.tl != null) {
            Complications.tl.draw(CenterX-sin30*Radius,CenterY-sin60*Radius);
          }

          if (Complications.tr != null) {
            Complications.tr.draw(CenterX+sin30*Radius,CenterY-sin60*Radius);
          }
        }

        if (Complications.l != null) {
          Complications.l.draw(CenterX-Radius,CenterY);
        }

        if (Complications.r != null) {
          Complications.r.draw(CenterX+Radius,CenterY);
        }

        if (Complications.b != null) {
          Complications.b.draw(CenterX,CenterY+sin60*Radius);
        } else {
          if (Complications.bl != null) {
            Complications.bl.draw(CenterX-sin30*Radius,CenterY+sin60*Radius);
          }

          if (Complications.br != null) {
            Complications.br.draw(CenterX+sin30*Radius,CenterY+sin60*Radius);
          }
        }
      }

      let now = new Date();

      let Hours   = now.getHours() % 12;
      let Minutes = now.getMinutes();
      let Seconds = now.getSeconds();

      let withSeconds = Bangle.isLCDOn();
      ClockHands.draw(
        Settings, CenterX,CenterY, outerRadius,
        Hours,Minutes,(withSeconds ? Seconds : null)
      );

      let Period = (withSeconds ? 1000 : 60000);

      let Pause = Period - (Date.now() % Period);
      Timer = setTimeout(refreshDisplay,Pause);
    }

    setTimeout(refreshDisplay, 500);               // enqueue first draw request

    Bangle.on('lcdPower', () => {
      if (Timer != null) { clearTimeout(Timer); Timer = undefined; }
      refreshDisplay();
    });

    Bangle.setUI('clock');
  };
})();
