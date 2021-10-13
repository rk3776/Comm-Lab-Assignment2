
imagesToBePreloaded = [
  'images/Panel6_Splash.png',
  'images/Panel6_FlyingAxolotl.png',
  'images/Panel6_AxolotlFinal.png',
  'images/Panel3_BoyB',
  'images/Panel3_BoyA',
  'images/Panel5_1.png',
  'images/Panel5_2.png',
  'images/Panel5_3.png',
  'images/Panel5_4.png',
  'images/Panel1_TextA.png',
  "images/Panel2_TextB.png",
  "images/Panel2_TextC.png",
  'images/Panel3_TextC.png',

]

var aquariumBreakSound = new Howl({
  src: ['sounds/aquariumBreak.mp3']
});

var aquariumKnockSound = new Howl({
  src: ['sounds/aquariumKnock.mp3']
});

var crackSound = new Howl({
  src: ['sounds/crack.mp3']
});

var hitGlassSound = new Howl({
  src: ['sounds/hitGlass.mp3']
});

var slidingSound = new Howl({
  src: ['sounds/sliding.mp3']
});

document.addEventListener("DOMContentLoaded", function() {
  initEventListeners();

  const panelSnapOptions = {
    container: document.body,
    panelSelector: '.comicContainer > section',
    directionThreshold: 100,
    delay: 100,
    duration: 600,
    easing: function(t) { return t },
  }
  const panelSnap = new PanelSnap(panelSnapOptions);

  var reachedFirstRow = false;
  var reachedSecondRow = false;
  var reachedThirdRow = false;
  var reachedFinalPanel = false;
  
  panelSnap.on("activatePanel", ( panel ) => {
    if ($(panel).hasClass('row1')) {
      if (!reachedFirstRow) { // only run this script once
        reachedFirstRow = true;
        hideScrollArrow();
        disableScroll();
      }
    }
    if ($(panel).hasClass('row2')) {
      if (!reachedSecondRow) { // only run this script once
        reachedSecondRow = true;
        hideScrollArrow();
        disableScroll();
        reachedThirdRow = false;
      }
    }
    if ($(panel).hasClass('row3')) {
      if (!reachedThirdRow) { // only run this script once
        reachedThirdRow = true;
        hideScrollArrow();
        disableScroll();
      }
    }
    // check if user has scrolled to final panel, if so, disable scrolling and start tracking user clikcs
    if ($(panel).hasClass('row4')) {
      if (!reachedFinalPanel) { // only run this script once
        reachedFinalPanel = true;
        hideScrollArrow();
        disableScroll();
      }
    }
  })

  // start by snapping to title
  $("body").css("overflow", "visible");
  panelSnap.snapToPanel($(".title")[0]);

  preload(imagesToBePreloaded);
});

function initEventListeners() {
  // panel 1 has to be viewed before 2, but its possible to scroll directly to panel 3 without viewing panels 1,2
  setupPanel1();
  setupPanel3();
  setupPanel5();
  setupPanel6();
}

// set up each panel to be viewed in sequence, they're all separate because
// you'll only be allowed to unblur the 2nd panel
// after hovering and completing the animation for the first one ( if any )

function setupPanel1() {
  const panel = $(".row1 > .panel1")[0];

  $(panel).one('mouseenter',() => {
    // on hover, unblur the image and add the text after 0.75s
    $(panel).addClass('unblur')

    setTimeout(() => {
      $('<img id="panel1Text" src="images/Panel1_TextA.png"/>').appendTo($(panel));
      setupPanel2();
    }, 750)
  })
}

function setupPanel2() {
  const panel = $(".row1 > .panel2")[0];

  $(panel).one('mouseenter',() => {
    $(panel).addClass('unblur')
  
    setTimeout(() => {
      $('<img id="panel2TextB" src="images/Panel2_TextB.png"/>').appendTo($(panel));
      setTimeout(() => {
        $('<img id="panel2TextC" src="images/Panel2_TextC.png"/>').appendTo($(panel));
        enableScroll();
        showScrollArrow();
      }, 1500)
    }, 750)
  })
}

function setupPanel3() {
  var boyFrameFlip;
  const panel = $(".row2 > .panel1")[0];

  $(panel).one('mouseenter',() => {
    $(panel).addClass('unblur')

    setTimeout(() => {
      $('<img id="panel3TextB" src="images/Panel3_TextB.png"/>').appendTo($(panel));
      // boy running animation
      setTimeout(() => {
        var frame = 1;
        $('<img id="panel3Boy" src="images/Panel3_BoyA.png"/>').appendTo($(panel));
        // flip between the two frames of the boy
        boyFrameFlip = setInterval(() => {
          if (frame == 1) {
            $('#panel3Boy').attr('src', "images/Panel3_BoyB.png");
            frame = 0;
          } else {
            $('#panel3Boy').attr('src', "images/Panel3_BoyA.png");
            frame = 1;
          }
        }, 500)
      }, 2500)

      
      setTimeout(() => {
        $('<img id="panel3TextC" src="images/Panel3_TextC.png"/>').appendTo($(panel));
        setupPanel4();
        clearInterval(boyFrameFlip);
      }, 7500)
    }, 750)
  })
}

function setupPanel4() {
  const panel = $(".row2 > .panel2")[0];

  $(panel).one('mouseenter',() => {

    $(panel).addClass('unblur');

    enableScroll();
    showScrollArrow();
  })
}

function setupPanel5() {
  const panel = $(".row3 > .panel1")[0];
  const panelImg = $(".row3 > .panel1 > img")[0]

  $(panel).one('mouseenter',() => {
    $(panel).addClass('unblur');

    $(panel).one('click', () => { // on first click
      aquariumKnockSound.play(); 
      $('.row3 #panel5ClickText').css('display', 'none');
      $(panelImg).attr('src', 'images/Panel5_2.png');
      setTimeout(() => {
        $(panelImg).attr('src', 'images/Panel5_3.png');
        $(panel).one('click', () => { // on second click
          aquariumKnockSound.play(); 
          crackSound.play(); 
          $(panelImg).attr('src', 'images/Panel5_4.png');
          
          enableScroll();
          showScrollArrow();
        });
      }, 300)
    });
  })
}

function addPanelHoverEventListeners() {
  $(".row2 .panel2").hover(() => {
    $(".row2 .panel2").addClass('unblur')
  })
}

function setupPanel6() {
  const panel = $(".row4 > .comicPanel")[0];
  $(panel).one('click', function() {
    aquariumBreakSound.play(); 
    // add splash image
    $('<img id="panel6SplashImage" src="images/Panel6_Splash.png"/>').appendTo($(panel));
    // add axolotl animation flying after 1.25s, 1s for splash to finish expanding
    setTimeout(() => {
      $('<img id="panel6Axolotl" src="images/Panel6_FlyingAxolotl.png"/>').appendTo($(panel));
      // time taken for axolotl to hit screen, 4s, then change image to splat image
      setTimeout(() => {
        
        hitGlassSound.play(); 
        $('#panel6Axolotl').attr('src', "images/Panel6_AxolotlFinal.png");
        // sneaky use of setTimeout to make sure that this is run after changing the image
        setTimeout(() => {
          $('#panel6Axolotl').css('height', '800px')
          $('#panel6Axolotl').addClass('slideAnimation')
          setTimeout(() => { slidingSound.play(); }, 2500); // time taken for slide animation to start
          setTimeout(() => { showCredits(); }, 10000); // show credits
        }, 10);
      }, 3400);
    }, 1250)
  });
}

function showCredits() {
  $('#creditsContainer').css("display", "flex");
  $('#creditsContainer').css("animation-play-state", "running");
}

function disableScroll() {
  $("body").css("overflow", "hidden");
}

function enableScroll() {
  $("body").css("overflow", "visible");
}

// shows the arrow that tells user to scroll
function showScrollArrow() {
  $("#downwardsArrow").css('display','block');
}

function hideScrollArrow() {
  $("#downwardsArrow").css('display','none');
}


// preload image function stolen from internet
// preloads the image, so when you insert it into the DOM with javascript it doesnt need a load time
function preload(arrayOfImages) {
  $(arrayOfImages).each(function(){
      $('<img/>')[0].src = this;
  });
}
