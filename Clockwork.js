(function () {
  exports.windUp = function windUp (Options, Settings) {
    Options  = Options || {};

    let ClockSize     = Options.size  || require('https://raw.githubusercontent.com/rozek/banglejs-2-smart-clock-size/main/ClockSize.js');
    let Background    = Options.background || undefined;
    let ClockFace     = Options.face;
    let ClockHands    = Options.hands || require('https://raw.githubusercontent.com/rozek/banglejs-2-rounded-clock-hands/main/ClockHands.js');
    let Complications = Options.complications || undefined;

    Settings = Object.assign({
      Foreground:'Theme', Background:'Theme'
    }, Settings || {});

    Bangle.loadWidgets();

    let CenterX = ClockSize.CenterX();
    let CenterY = ClockSize.CenterY();

    let outerRadius = ClockSize.outerRadius();

    let Timer;
    function refreshDisplay () {
      g.reset();
      if (Background == null) {
        g.setBgColor(Settings.Background === 'Theme' ? g.theme.bg : Settings.Background || '#FFFFFF');
        g.clear();
      } else {
        Background.draw(Settings);
      }

      Bangle.drawWidgets();

      if (ClockFace != null) {
        ClockFace.draw(Settings, CenterX,CenterY, outerRadius);
      }

      if (Complications != null) {
        let PlacementRadius    = outerRadius * 0.4;
        let ComplicationRadius = outerRadius * 0.3/2;

        let sin30 = 0.5;
        let sin60 = 0.866;

        if (Complications.t != null) {
          Complications.t.draw(
            CenterX,CenterY-sin60*PlacementRadius,
            ComplicationRadius, Settings
          );
        } else {
          if (Complications.tl != null) {
            Complications.tl.draw(
              CenterX-sin30*PlacementRadius,CenterY-sin60*PlacementRadius,
              ComplicationRadius, Settings
            );
          }

          if (Complications.tr != null) {
            Complications.tr.draw(
              CenterX+sin30*PlacementRadius,CenterY-sin60*PlacementRadius,
              ComplicationRadius, Settings
            );
          }
        }

        if (Complications.l != null) {
          Complications.l.draw(
            CenterX-PlacementRadius,CenterY,
            ComplicationRadius, Settings
          );
        }

        if (Complications.r != null) {
          Complications.r.draw(
            CenterX+PlacementRadius,CenterY,
            ComplicationRadius, Settings
          );
        }

        if (Complications.b != null) {
          Complications.b.draw(
            CenterX,CenterY+sin60*PlacementRadius,
            ComplicationRadius, Settings
          );
        } else {
          if (Complications.bl != null) {
            Complications.bl.draw(
              CenterX-sin30*PlacementRadius,CenterY+sin60*PlacementRadius,
              ComplicationRadius, Settings
            );
          }

          if (Complications.br != null) {
            Complications.br.draw(
              CenterX+sin30*PlacementRadius,CenterY+sin60*PlacementRadius,
              ComplicationRadius, Settings
            );
          }
        }
      }

      let now = new Date();

      let Hours   = now.getHours() % 12;
      let Minutes = now.getMinutes();
      let Seconds = now.getSeconds();

      let withSeconds = (Settings.Seconds != null) && Bangle.isLCDOn();
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
