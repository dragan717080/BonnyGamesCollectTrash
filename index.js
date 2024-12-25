/** Generate random number between lower and higher bound (inclusive). */
const generateRandomNumberInLimits = (upper, lower = 1) => Math.floor(Math.random() * upper) + lower;

/** Generate trash elements, if `trashCount > 1`, add padding between. */
const makeTrashElements = (trashCount) => {
  // Which images will be active
  const num1 = generateRandomNumberInLimits(11);
  const num2 = generateRandomNumberInLimits(11);
  const num3 = generateRandomNumberInLimits(11);
  const num4 = generateRandomNumberInLimits(11);

  return trashCount === 1
    ? `<div class='trash absolute top-1/2 right-0 h-18 w-18 bg-lightgreen rounded-full'>
          <img src='./images/trash-${num1}.png' class='absolute top-1/2 -left-1.5 -translate-y-1/2 min-h-18 h-18 w-20 max-w-none' alt='Trash'>  
        </div>`
    : trashCount === 2
      ? `<div class='flex flex-col space-y-3 absolute top-1/2 -translate-y-1/2 right-2'>
          <div class='trash top-1/2 right-0 h-18 w-18 bg-lightgreen rounded-full'>
            <img src='./images/trash-${num1}.png' class='absolute top-1/2 -left-1.5 -translate-y-1/2 min-h-18 h-18 w-20 max-w-none' alt='Trash'>  
          </div>
          <div class='trash top-1/2 right-0 h-18 w-18 bg-lightgreen rounded-full'>
            <img src='./images/trash-${num2}.png' class='absolute top-1/2 -left-1.5 -translate-y-1/2 min-h-18 h-18 w-20 max-w-none' alt='Trash'>  
          </div>
        </div>`
      : `<div class='flex flex-col space-y-3 absolute top-1/2 -translate-y-1/2 right-2'>
          <div class='trash h-18 w-18 bg-lightgreen rounded-full -ml-5'>
            <img src='./images/trash-${num1}.png' class='absolute top-1/2 -left-1.5 -translate-y-1/2 min-h-18 h-18 w-20 max-w-none' alt='Trash'>
          </div>
          <div class='trash h-18 w-18 bg-lightgreen rounded-full'>
            <img src='./images/trash-${num2}.png' class='absolute top-1/2 -left-1.5 -translate-y-1/2 min-h-18 h-18 w-20 max-w-none' alt='Trash'>
          </div>
          <div class='trash h-18 w-18 bg-lightgreen rounded-full ml-5'>
            <img src='./images/trash-${num3}.png' class='absolute top-1/2 -left-1.5 -translate-y-1/2 min-h-18 h-18 w-20 max-w-none' alt='Trash'>
          </div>
        </div>`
}

window.addEventListener('DOMContentLoaded', () => {
  /** Start game, and create trash to put into buckets. */
  const game = () => {
    let lives = 100000000000;
    const gameContainer = document.getElementById('game-container');
    let position = 0;
    const speed = 0;
    let trashElements;
    let trashImages;

    const animateBackground = () => {
      position -= speed;
      gameContainer.style.backgroundPosition = `${position}px 0`;
      requestAnimationFrame(animateBackground);
    }

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const generateTrash = async () => {
      const { width: w, height: h } = gameContainer.getBoundingClientRect();
      let ticks = 0;
      // Which trash was put into the basket
      let movedTrashIndex;
      const binOne = document.getElementById('bin-1');
      const binTwo = document.getElementById('bin-2');

      const addTrash = () => {
        // How many trash to generate at same time
        //const trashCount = generateRandomNumberInLimits(3);
        const trashCount = 3;

        // console.log(trashElements);

        gameContainer.insertAdjacentHTML('beforeend', makeTrashElements(trashCount));

        // After trash is no longer visible, remove it
        ticks++;

        console.log(trashElements?.map(element => element.style.opacity));
        console.log('recomputing trash e');
        trashElements = Array.from(document.getElementsByClassName('trash'))
          .filter(element => window.getComputedStyle(element).opacity > 0);
        console.log('new trash elements:', trashElements);

        // Remove oldest element
        /*         if (ticks > 7) {
                  trashElements[0].remove();
                } */

        // Add drag and drop for images
        trashImages = Array.from(trashElements.map(trashElement => trashElement.getElementsByTagName('img')[0]));
        console.log('trash elements len:', trashElements.length);
        //console.log('Trash elements:', trashElements);
        //console.log(trashImages);


        trashImages.forEach(async (trashImage, imageIndex) => {
          while (trashImage && trashImage.getBoundingClientRect().x === 0) {
            console.log('waiting');

            await wait(10);
          }

          const { x: startX, y: startY } = trashImage.getBoundingClientRect();
          //console.log('START CONTAINER:', trashImage.parentNode.parentNode.getBoundingClientRect());
          //console.log('start', trashImage.getBoundingClientRect());

          //console.log(trashImage);

          // Add mobile screens touch listener
          trashImage.addEventListener('touchmove', (e) => handleTouchMove(e, trashImage, imageIndex, startX, startY));
        });
      }

      /** If trash left the viewport, remove it. */
      const checkIfLeftTheViewport = () => {
        const outOfViewportCount = trashImages.reduce((acc, x) => acc + Number(!(x.style.opacity === '')), 0);
        //console.log('elements out of viewport:', outOfViewportCount);
        trashImages.forEach(async (image, leftViewportIndex) => {
          console.log(typeof(trashElements[leftViewportIndex].style.opacity));
          const notHidden = trashElements[leftViewportIndex].style.opacity === '';
          if (image.getBoundingClientRect().right < 0 && notHidden) {
            lives--;
            //console.log('You have', lives, 'left');
            trashElements.splice(leftViewportIndex, 1);
            trashImages.splice(leftViewportIndex, 1);
            document.getElementsByClassName('trash')[leftViewportIndex].style.opacity = 0;
            console.log('removing with index', leftViewportIndex);
            console.log('There are', trashElements.length, 'trash elements left');
            const livesElement = document.getElementById('lives');
            livesElement.innerText = lives;
          }
        });
      }

      // Add mobile screens touch listener
      const handleTouchMove = (e, trashImage, imageIndex, startX, startY) => {
        //console.log('touch event:', e);
        const touchLocation = e.targetTouches[0];
        const touchTarget = touchLocation.target;
        console.log(touchTarget);
        const { width: startWidth, height: startHeight } = trashImage.getBoundingClientRect();

        console.log('start left:', trashImage.style.left);
        console.log('start:', startHeight, startWidth);
        trashImage.parentNode?.classList.remove('bg-lightgreen');


        const newLocationLeft = touchLocation.pageX;
        const newLocationTop = touchLocation.pageY;
        console.log('%cnew location left:', 'color:red', newLocationLeft, 'new location top:', newLocationTop);
        const moveX = Math.round(touchLocation.pageX - startX);
        const moveY = Math.round(touchLocation.pageY - startY);
        //console.log('move X:', moveX, 'move Y:', moveY);
        trashImage.classList.remove('-translate-y-1/2');
        //console.log('new transform value:', `translateX(calc(-1rem + ${moveX}px)) translateY(calc(-50% + ${moveY}px))`);

        trashImage.style.transform = `translateX(calc(-1rem + ${moveX}px)) translateY(calc(-50% + ${moveY}px))`;
        //console.log('transforms:', trashImage.style.transform);
        checkIfTrashInBin(newLocationLeft, newLocationTop, trashImage, imageIndex);
        checkIfTrashInBin(newLocationLeft, newLocationTop, trashImage, imageIndex, false);
        //trashImage.classList.remove('absolute');
        //trashImage.classList.add('relative');

        //console.log(touchLocation);;


      };

      const checkIfTrashInBin = (trashImageLeft, trashImageTop, image, imageIndex, isBinOne = true,) => {
        const binElement = isBinOne ? binOne : binTwo;
        const { height: binHeight, width: binWidth, top: binTop, bottom: binBottom, left: binLeft, right: binRight } = binElement.getBoundingClientRect();

        console.log('starting bin coordinates:', binElement.getBoundingClientRect());

        // Roughly between 35% and 70% on X axis and 5% and 15% of bin on Y axis is where u put trash
        const leftMargin = binLeft + binWidth * 0.35;
        const rightMargin = binLeft + binWidth * 0.60;
        const topMargin = binTop + binHeight * 0.05;
        const bottomMargin = binTop + binHeight * 0.2;
        if (!isBinOne) {
          console.log('LEFT MARGIN:', leftMargin);
          console.log('RIGHT MARGIN:', rightMargin);
          console.log('TOP MARGIN:', topMargin);
          console.log('BOTTOM MARGIN:', bottomMargin);
        }

        console.log('trash image left:', trashImageLeft, 'trash image top:', trashImageTop);

        // Since images are large, give them space on the side
        const isInBin = trashImageLeft > leftMargin - 10 && trashImageLeft < rightMargin - 25;
        // To do: move same line as `isInBin`
        const isInBinY = trashImageTop > topMargin && trashImageTop < bottomMargin;

        if (isInBin) {
          console.log('%cin bin', 'font-size:16px');

        }
        if (isInBinY) {
          console.log('%cin bin on Y axis', 'font-size:16px');

        }

        // Hit bin, remove image
        if (isInBin && isInBinY) {
          image.parentNode.style.opacity = 0;
          console.log('%cremoved', 'color:red; font-size:16px');
          console.log('removing with image index', imageIndex);
          trashElements.splice(imageIndex, 1);
          trashImages.splice(imageIndex, 1);
          console.log('new trash elements after elements after removal:', trashElements);
          console.log('new trash images after removal', trashImages);
        }

      }

      addTrash();

      // 1232323500
      setInterval(addTrash, 3500);

      setInterval(checkIfLeftTheViewport, 251);
    }

    animateBackground();
    generateTrash();

    window.addEventListener('click', (e) => handleTrashClick(e));
  };

  /** Put trash in bin. */
  const handleTrashClick = (e) => {

  }

  game();
});
