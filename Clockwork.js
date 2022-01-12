;(function () {
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
      Timer = undefined;

      g.reset();
      if (Background == null) {
        g.setBgColor(Settings.Background === 'Theme' ? g.theme.bg : Settings.Background || '#FFFFFF');
        g.clear(false);
      } else {
        try {
          Background.draw(Settings);
        } catch (Signal) { print('Error drawing background: ',Signal); }
      }

      Bangle.drawWidgets();

      if (ClockFace != null) {
        try {
          ClockFace.draw(Settings, CenterX,CenterY, outerRadius);
        } catch (Signal) { print('Error drawing clock face: ',Signal); }
      }

      if (Complications != null) {
        let PlacementRadius    = outerRadius * 0.4;
        let ComplicationRadius = outerRadius * 0.3/2;

        let sin30 = 0.5;
        let sin60 = 0.866;

        if (Complications.t != null) {
          try {
            Complications.t.draw(
              CenterX,CenterY-sin60*PlacementRadius,
              ComplicationRadius, Settings
            );
          } catch (Signal) { print('Error drawing complication at position "t": ',Signal); }
        } else {
          if (Complications.tl != null) {
            try {
              Complications.tl.draw(
                CenterX-sin30*PlacementRadius,CenterY-sin60*PlacementRadius,
                ComplicationRadius, Settings
              );
            } catch (Signal) { print('Error drawing complication at position "tl": ',Signal); }
          }

          if (Complications.tr != null) {
            try {
              Complications.tr.draw(
                CenterX+sin30*PlacementRadius,CenterY-sin60*PlacementRadius,
                ComplicationRadius, Settings
              );
            } catch (Signal) { print('Error drawing complication at position "tr": ',Signal); }
          }
        }

        if (Complications.l != null) {
          try {
            Complications.l.draw(
              CenterX-PlacementRadius,CenterY,
              ComplicationRadius, Settings
            );
          } catch (Signal) { print('Error drawing complication at position "l": ',Signal); }
        }

        if (Complications.r != null) {
          try {
            Complications.r.draw(
              CenterX+PlacementRadius,CenterY,
              ComplicationRadius, Settings
            );
          } catch (Signal) { print('Error drawing complication at position "r": ',Signal); }
        }

        if (Complications.b != null) {
          try {
            Complications.b.draw(
              CenterX,CenterY+sin60*PlacementRadius,
              ComplicationRadius, Settings
            );
          } catch (Signal) { print('Error drawing complication at position "b": ',Signal); }
        } else {
          if (Complications.bl != null) {
            try {
              Complications.bl.draw(
                CenterX-sin30*PlacementRadius,CenterY+sin60*PlacementRadius,
                ComplicationRadius, Settings
              );
            } catch (Signal) { print('Error drawing complication at position "bl": ',Signal); }
          }

          if (Complications.br != null) {
            try {
              Complications.br.draw(
                CenterX+sin30*PlacementRadius,CenterY+sin60*PlacementRadius,
                ComplicationRadius, Settings
              );
            } catch (Signal) { print('Error drawing complication at position "br": ',Signal); }
          }
        }
      }

      let now = new Date();

      let Hours   = now.getHours() % 12;
      let Minutes = now.getMinutes();
      let Seconds = now.getSeconds();

      let withSeconds = (Settings.Seconds != null) && ! Bangle.isLocked();
      try {
        ClockHands.draw(
          Settings, CenterX,CenterY, outerRadius,
          Hours,Minutes,(withSeconds ? Seconds : null)
        );
      } catch (Signal) { print('Error drawing clock hands: ',Signal); }

      let Period = (withSeconds ? 1000 : 60000);

      let Pause = Period - (Date.now() % Period);
      Timer = setTimeout(refreshDisplay,Pause);
    }

    Timer = setTimeout(refreshDisplay, 500);       // enqueue first draw request

    Bangle.on('lock', () => {
      if (Timer != null) { clearTimeout(Timer); Timer = undefined; }
      refreshDisplay();
    });

    Bangle.setUI('clock');
  };
})();
