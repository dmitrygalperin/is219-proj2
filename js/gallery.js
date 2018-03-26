// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function swapPhoto() {
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded
	//from the JSON string
  if(mCurrentIndex < 0)
    mCurrentIndex = mImages.length + mCurrentIndex;
  else if(mCurrentIndex > mImages.length-1)
    mCurrentIndex = mCurrentIndex - mImages.length;

  var currentImg = mImages[mCurrentIndex++]
  var imgTag = $('#slideShow').find('.thumbnail');
  var details = $('.details');
  imgTag.attr('src', currentImg.img);
  details.find('.location').text(`Location: ${currentImg.location}`);
  details.find('.description').text(`Description: ${currentImg.description}`);
  details.find('.date').text(`Date: ${currentImg.date}`);
}

// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = 'images.json';

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {

	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();

});

window.addEventListener('load', function() {

	console.log('window loaded');

}, false);

function GalleryImage(location, description, date, img) {
  this.location = location;
  this.description = description;
  this.date = date;
  this.img = img;
}

function initGallery(imgsArr) {
  var mImages = []
  for(var i in imgsArr) {
    img = imgsArr[i]
    mImages.push(
      new GalleryImage(
        img.imgLocation,
        img.description,
        img.date,
        img.imgPath
      )
    )
  }
  return mImages;
}

function getAlternateJson() {
  return location.search.split('?json=')[1];
}

mRequest.onreadystatechange = function() {
  if (this.readyState == 4) {
    if(this.status == 200) {
      var imgsObj = JSON.parse(this.responseText);
      var nextPhoto = $('#nextPhoto');
      var prevPhoto = $('#prevPhoto');
      var moreIndicator = $('.moreIndicator');

      mImages = initGallery(imgsObj.images)
      swapPhoto();

      nextPhoto.click(() => {
        swapPhoto();
      });

      nextPhoto.hover(
        () => {
          nextPhoto.css('opacity', '0.8');
        },
        () => {
          nextPhoto.css('opacity', '1.0');
        }
      );

      prevPhoto.hover(
        () => {
          prevPhoto.css('opacity', '0.8');
        },
        () => {
          prevPhoto.css('opacity', '1.0');
        }
      );

      nextPhoto.css('float', 'right');

      moreIndicator.css('float', 'center');

      prevPhoto.click(() => {
        mCurrentIndex-=2;
        swapPhoto();
      });

      $('.moreIndicator').click(() => {
        var more = $('.moreIndicator');
        var details = $('.details');
        details.fadeToggle('fast');
        if(more.hasClass('rot90')) {
          more.removeClass('rot90');
          more.addClass('rot270');
        } else {
          more.removeClass('rot270');
          more.addClass('rot90');
        }
      });
    } else {
      openDefaultJson()
    }
  }
};

function openDefaultJson() {
  mRequest.open("GET", mUrl, true);
  mRequest.send();
}

mRequest.open("GET", getAlternateJson(), true);
mRequest.send();
