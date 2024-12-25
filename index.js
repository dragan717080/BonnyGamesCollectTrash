/** Generate random number between lower and higher bound (inclusive). */
const generateRandomNumberInLimits = (upper, lower=1) => Math.floor(Math.random() * upper) + lower;

/** Generate trash elements, if `trashCount > 1`, add padding between. */
const makeTrashElements = (trashCount) => {
  // Which images will be active
  const num1 = generateRandomNumberInLimits(11);
  const num2 = generateRandomNumberInLimits(11);
  const num3 = generateRandomNumberInLimits(11);
  const num4 = generateRandomNumberInLimits(11);

  return trashCount === 1
    ? `<div class='trash absolute top-1/2 right-0 h-20 w-20 bg-lightgreen rounded-full'>
          <img src='./images/trash-${num1}.png' class='absolute top-1/2 -left-4 -translate-y-1/2 h-22 w-25 max-w-none' alt='Trash'>  
        </div>`
    : trashCount === 2
      ? `<div>
          <div class='trash absolute top-1/2 right-0 h-20 w-20 bg-lightgreen rounded-full'>
            <img src='./images/trash-${num1}.png' class='absolute top-1/2 -left-4 -translate-y-1/2 h-22 w-25 max-w-none' alt='Trash'>  
          </div>
          <div class='trash absolute top-1/2 right-0 h-20 w-20 bg-lightgreen rounded-full'>
            <img src='./images/trash-${num1}.png' class='absolute top-1/2 -left-4 -translate-y-1/2 h-22 w-25 max-w-none' alt='Trash'>  
          </div>
        </div>`
      : `<div class='flex flex-col space-y-3 absolute top-1/2 -translate-y-1/2 right-2'>
          <div class='trash h-20 w-20 bg-lightgreen rounded-full'>
            <img src='./images/trash-${num1}.png' class='absolute top-1/2 -left-4 -translate-y-1/2 h-22 w-25 max-w-none' alt='Trash'>
          </div>
          <div class='trash h-20 w-20 bg-lightgreen rounded-full'>
            <img src='./images/trash-${num2}.png' class='absolute top-1/2 -left-4 -translate-y-1/2 h-22 w-25 max-w-none' alt='Trash'>
          </div>
          <div class='trash h-20 w-20 bg-lightgreen rounded-full'>
            <img src='./images/trash-${num3}.png' class='absolute top-1/2 -left-4 -translate-y-1/2 h-22 w-25 max-w-none' alt='Trash'>
          </div>
        </div>`
}

window.addEventListener('DOMContentLoaded', () => {
  /** Start game, and create trash to put into buckets. */
  const game = () => {
    const gameContainer = document.getElementById('game-container');
    let position = 0;
    const speed = 0;

    const animateBackground = () => {
      position -= speed;
      gameContainer.style.backgroundPosition = `${position}px 0`;
      requestAnimationFrame(animateBackground);
    }

    const generateTrash = () => {
      const { width: w, height: h } = gameContainer.getBoundingClientRect();
      let ticks = 0;
      let draggedImageSrc;
      // Which trash was put into the basket
      let movedTrashIndex;
      let trashElements;
      let trashImages;

      const addTrash = () => {
        // How many trash to generate at same time
        //const trashCount = generateRandomNumberInLimits(3);
        const trashCount = 2;

        gameContainer.insertAdjacentHTML('beforeend', makeTrashElements(trashCount));

        // After trash is no longer visible, remove it
        ticks++;

        trashElements = Array.from(document.getElementsByClassName('trash'));
        console.log('new trash elements:', trashElements);

        // Remove oldest element
        /*         if (ticks > 7) {
                  trashElements[0].remove();
                } */

        // Add drag and drop for images
        trashImages = Array.from(trashElements.map(trashElement => trashElement.getElementsByTagName('img')[0]));

        const binOne = document.getElementById('bin-1');
        const binTwo = document.getElementById('bin-2');

        trashImages.forEach((trashImage, imageIndex) => {
          //console.log(trashImage);

          trashImage.addEventListener('dragstart', (e) => {
            draggedImageSrc = trashImage.src;
            movedTrashIndex = imageIndex;
            console.log('Event:', e);

            console.log(`drag image with index ${imageIndex}`);

            // Get initial position of the mouse
            e.dataTransfer.setDragImage(trashImage, 50, 50); // Optional: adjust the drag image position
          });
          // Add mobile screens touch listener
          trashImage.addEventListener('touchmove', (e) => {
            //console.log('touch event:', e);
            const touchLocation = e.targetTouches[0];
            const touchTarget = touchLocation.target;
            console.log(touchTarget)
            
            trashImage.style.left = touchLocation.pageX + 'px';
            trashImage.style.top = touchLocation.pageY + 'px';
            //console.log(touchLocation);;
            
            
          });

          trashImage.addEventListener('touchend', (e) => {
            console.log('touch ended');
            console.log('touch end event:', e);
            console.log(e.target);
            console.log(e.targetTouches);
            
            
          });
        });

        // Function to handle dragover event on bins
        const handleDragOver = (e) => {
          e.preventDefault(); // This is required to allow a drop event to happen
        };

        binOne.addEventListener('dragover', handleDragOver);  // Enable dropping in bin-1
        binTwo.addEventListener('dragover', handleDragOver);  // Enable dropping in bin-2

        binOne.addEventListener('drop', (e) => handleDrop(e, 'bin-1'));  // Handle drop in bin-1
        binTwo.addEventListener('drop', (e) => handleDrop(e, 'bin-2'));  // Handle drop in bin-2
      }

      // Handle drop event for bin-1
      const handleDrop = (e, binId) => {
        e.preventDefault();
        console.log(draggedImageSrc); // Find the dragged image element

        if (draggedImageSrc) {
          // Remove the trash image after it's dropped
          console.log('old trash:', document.getElementsByClassName('trash'));
          console.log('moved trash index:', movedTrashIndex);
          trashElements.splice(movedTrashIndex, 1);
          trashImages.splice(movedTrashIndex, 1);
          document.getElementsByClassName('trash')[movedTrashIndex].remove();
          console.log('new trash:', document.getElementsByClassName('trash'));
          console.log(`Trash dropped in ${binId}`);
        }
      };

      /** If trash left the viewport, remove it. */
      const checkIfLeftTheViewport = () => {
        trashImages.forEach((image, leftViewportIndex) => {
          if (leftViewportIndex !== 0) return;
          if (image.getBoundingClientRect().right < 0) {
            trashElements.splice(movedTrashIndex, 1);
            trashImages.splice(movedTrashIndex, 1);
            trashElements.splice(movedTrashIndex, 1);
            trashImages.splice(movedTrashIndex, 1);
            document.getElementsByClassName('trash')[leftViewportIndex].remove();
          }
        });
      }

      addTrash();

      setInterval(addTrash, 13223232500);

      setInterval(checkIfLeftTheViewport, 500);
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
