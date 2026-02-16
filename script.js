class MagnifyingGlass {
    constructor() {
        this.artworkImg = document.getElementById('myimage');
        this.magnifyingGlass = document.querySelector('.magnifying-glass');
        this.isActive = false;
        this.isEnabled = false; // Start disabled until objects are found
        this.zoomLevel = 2.5;
        this.init();
    }

    init() {
        if (!this.artworkImg || !this.magnifyingGlass) {
            console.error('Required elements not found');
            return;
        }
        // Don't setup magnifying glass initially - wait until enabled
    }

    enable() {
        this.isEnabled = true;
        this.setupMagnifyingGlass();
    }

    disable() {
        this.isEnabled = false;
        this.hideMagnifier();
        // Remove event listeners
        this.artworkImg.removeEventListener('mouseenter', this.showMagnifier.bind(this));
        this.artworkImg.removeEventListener('mouseleave', this.hideMagnifier.bind(this));
        this.artworkImg.removeEventListener('mousemove', this.moveMagnifier.bind(this));
    }

    setupMagnifyingGlass() {
        // Set up the magnifying glass background
        this.magnifyingGlass.style.backgroundImage = `url(${this.artworkImg.src})`;
        this.magnifyingGlass.style.backgroundSize = `${this.artworkImg.offsetWidth * this.zoomLevel}px ${this.artworkImg.offsetHeight * this.zoomLevel}px`;
        
        // Mouse events
        this.artworkImg.addEventListener('mouseenter', this.showMagnifier.bind(this));
        this.artworkImg.addEventListener('mouseleave', this.hideMagnifier.bind(this));
        this.artworkImg.addEventListener('mousemove', this.moveMagnifier.bind(this));
        
        // Touch events for mobile
        this.artworkImg.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.artworkImg.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.artworkImg.addEventListener('touchend', this.hideMagnifier.bind(this));
        
        // Resize event
        window.addEventListener('resize', this.updateMagnifierSize.bind(this));
    }

    showMagnifier() {
        if (!this.isEnabled) return; // Don't show if not enabled
        this.isActive = true;
        this.magnifyingGlass.style.display = 'block';
        this.updateMagnifierSize();
    }

    hideMagnifier() {
        this.isActive = false;
        this.magnifyingGlass.style.display = 'none';
    }

    updateMagnifierSize() {
        if (!this.isActive) return;
        
        const imgRect = this.artworkImg.getBoundingClientRect();
        this.magnifyingGlass.style.backgroundSize = `${imgRect.width * this.zoomLevel}px ${imgRect.height * this.zoomLevel}px`;
    }

    moveMagnifier(e) {
        if (!this.isActive || !this.isEnabled) return;
        
        e.preventDefault();
        const imgRect = this.artworkImg.getBoundingClientRect();
        
        // Calculate mouse position relative to image
        const x = e.clientX - imgRect.left;
        const y = e.clientY - imgRect.top;
        
        // Position magnifying glass
        const glassSize = this.magnifyingGlass.offsetWidth;
        this.magnifyingGlass.style.left = (e.clientX - glassSize / 2) + 'px';
        this.magnifyingGlass.style.top = (e.clientY - glassSize / 2) + 'px';
        
        // Calculate background position for zoom effect
        const bgX = -(x * this.zoomLevel - glassSize / 2);
        const bgY = -(y * this.zoomLevel - glassSize / 2);
        
        this.magnifyingGlass.style.backgroundPosition = `${bgX}px ${bgY}px`;
    }

    handleTouchStart(e) {
        e.preventDefault();
        this.showMagnifier();
        this.handleTouchMove(e);
    }

    handleTouchMove(e) {
        if (!this.isActive || !this.isEnabled) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const imgRect = this.artworkImg.getBoundingClientRect();
        
        // Calculate touch position relative to image
        const x = touch.clientX - imgRect.left;
        const y = touch.clientY - imgRect.top;
        
        // Position magnifying glass
        const glassSize = this.magnifyingGlass.offsetWidth;
        this.magnifyingGlass.style.left = (touch.clientX - glassSize / 2) + 'px';
        this.magnifyingGlass.style.top = (touch.clientY - glassSize / 2) + 'px';
        
        // Calculate background position for zoom effect
        const bgX = -(x * this.zoomLevel - glassSize / 2);
        const bgY = -(y * this.zoomLevel - glassSize / 2);
        
        this.magnifyingGlass.style.backgroundPosition = `${bgX}px ${bgY}px`;
    }
}

class AnswerRevealSystem {
    constructor() {
        this.setupAnswerInputs();
    }

    setupAnswerInputs() {
        const responseSections = document.querySelectorAll('.response-section');
        console.log('Found response sections:', responseSections.length);

        responseSections.forEach((section, index) => {
            console.log(`Setting up section ${index}:`, section.id);
            
            // Skip step-3 as it has its own dedicated system
            if (section.closest('#step-3')) {
                console.log('Skipping step-3 - has dedicated reveal system');
                return;
            }
            
            const input = section.querySelector('.magic-input');
            const multipleChoice = section.querySelector('.multiple-choice');
            const revealBtn = section.querySelector('.reveal-btn');
            let container = section.querySelector('.answers-container');
            
            console.log(`Section ${index} elements:`, {
                input: !!input,
                multipleChoice: !!multipleChoice,
                revealBtn: !!revealBtn,
                container: !!container
            });
            
            // Create answers-container if it doesn't exist
            if (!container) {
                container = document.createElement('div');
                container.className = 'answers-container';
                // Insert ABOVE the input or multiple choice, not below
                if (input) {
                    section.insertBefore(container, input);
                } else if (multipleChoice) {
                    section.insertBefore(container, multipleChoice);
                }
            }
            
            // Handle text input questions
            if (input) {
                input.addEventListener('keydown', (e) => {
                    console.log('Key pressed:', e.key, 'Value:', input.value);
                    
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        
                        if (!input.disabled && input.value.trim().length > 0) {
                            const userAnswer = input.value.trim();
                            console.log('Revealing user answer:', userAnswer);
                            this.showUserAnswer(input, userAnswer, container);
                        }
                    }
                });
            }
            
            // Handle reveal button for both text and multiple choice
            if (revealBtn) {
                revealBtn.addEventListener('click', (e) => {
                    console.log(`Reveal button clicked for section:`, section.id);
                    console.log('Is multiple choice?', !!multipleChoice);
                    // Check if this is a multiple choice question
                    if (multipleChoice) {
                        console.log('Handling as multiple choice');
                        this.handleMultipleChoiceReveal(section, container);
                    } else {
                        // Handle text input
                        const input = section.querySelector('.magic-input');
                        if (input && !input.disabled) {
                            const userAnswer = input.value.trim();
                            if (userAnswer.length > 0) {
                                this.showUserAnswer(input, userAnswer, container);
                            } else {
                                this.showUserAnswer(input, 'Respuesta revelada', container);
                            }
                        }
                    }
                });
            }
        });
    }

    handleMultipleChoiceReveal(section, container) {
        const selectedRadio = section.querySelector('input[type="radio"]:checked');
        const revealBtn = section.querySelector('.reveal-btn');
        const correctAnswer = 'todas'; // The correct answer value
        
        if (!selectedRadio) {
            // No selection made
            this.showMultipleChoiceResult(container, null, correctAnswer, revealBtn, section);
        } else {
            // Check if correct
            const selectedValue = selectedRadio.value;
            const isCorrect = selectedValue === correctAnswer;
            this.showMultipleChoiceResult(container, selectedValue, correctAnswer, revealBtn, section, isCorrect);
        }
    }

    showMultipleChoiceResult(container, selectedValue, correctAnswer, revealBtn, section, isCorrect = null) {
        // Clear any existing answers in this container
        container.innerHTML = '';
        
        // Make the answers container visible
        container.style.display = 'flex';
        
        if (selectedValue === null) {
            // No selection made
            const feedbackBubble = document.createElement('div');
            feedbackBubble.className = 'answer-bubble encouraging';
            feedbackBubble.innerHTML = `
                <span class="answer-text">¡Selecciona una opción primero!</span>
            `;
            container.appendChild(feedbackBubble);
            return;
        }
        
        // Show result based on correctness
        const answerBubble = document.createElement('div');
        if (isCorrect) {
            answerBubble.className = 'answer-bubble correct';
            answerBubble.innerHTML = `
                <span class="answer-text">¡Correcto! ✓ Todas las opciones son válidas para explicar el fondo neutro.</span>
            `;
            this.addConfettiCelebration(container);
            this.playSuccessSound();
        } else {
            answerBubble.className = 'answer-bubble user-attempt';
            const selectedText = section.querySelector(`input[value="${selectedValue}"] + span`).textContent;
            answerBubble.innerHTML = `
                <span class="answer-text">Has elegido: "${selectedText}"</span>
            `;
            
            // Show encouraging message and correct answer
            setTimeout(() => {
                const correctBubble = document.createElement('div');
                correctBubble.className = 'answer-bubble correct';
                correctBubble.innerHTML = `
                    <span class="answer-text">La respuesta correcta es: "¡Todas son correctas!" ✓</span>
                `;
                container.appendChild(correctBubble);
                this.addConfettiCelebration(container);
            }, 1000);
        }
        
        container.appendChild(answerBubble);
        
        // Disable the multiple choice and hide reveal button
        const radioButtons = section.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => radio.disabled = true);
        
        const choiceOptions = section.querySelectorAll('.choice-option');
        choiceOptions.forEach(option => {
            option.style.opacity = '0.7';
            option.style.cursor = 'not-allowed';
        });
        
        if (revealBtn) {
            revealBtn.style.display = 'none';
        }
        
        // If this is step 3 (multiple choice), show the "Finalizar experiencia" button
        if (section.id === 'step-3') {
            console.log('Step 3 detected, showing finalizar button');
            const completeBtn = document.getElementById('complete-experience');
            if (completeBtn) {
                console.log('Found finalizar button, making it visible');
                completeBtn.classList.add('show');
                completeBtn.style.display = 'inline-block'; // Force display
                // Only add the event listener if it hasn't been added already
                if (!completeBtn.hasAttribute('data-listener-added')) {
                    completeBtn.setAttribute('data-listener-added', 'true');
                    completeBtn.addEventListener('click', () => {
                        console.log('Finalizar button clicked');
                        // Find the answer system instance to call completeStep3
                        if (window.answerSystemInstance) {
                            window.answerSystemInstance.completeStep3();
                        }
                    });
                }
            } else {
                console.error('Finalizar button not found!');
            }
        }
    }

    // FIXED: Show whatever the user wrote
    showUserAnswer(input, answer, container) {
        // Clear any existing answers in this container
        container.innerHTML = '';
        
        // Make the answers container visible
        container.style.display = 'flex';
        
        const answerBubble = document.createElement('div');
        answerBubble.className = 'answer-bubble revealed';
        answerBubble.innerHTML = `
            <span class="answer-text">${answer}</span>
        `;
        
        // Add above the input
        container.appendChild(answerBubble);
        
        // Disable input and hide reveal button
        input.disabled = true;
        input.style.background = 'white';
        input.style.opacity = '0.7';
        
        const revealBtn = input.parentElement.querySelector('.reveal-btn');
        if (revealBtn) {
            revealBtn.style.display = 'none';
        }
        
        // Add celebration effect
        this.addConfettiCelebration(container);
    }

    addConfettiCelebration(container) {
        // Create confetti pieces around the answer
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'answer-confetti';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
                
                container.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 2500);
            }, i * 50);
        }
    }

    playSuccessSound() {
        try {
            const audio = new Audio('assets/ding.mp3');
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Audio play failed:', e));
        } catch (e) {
            console.log('Success sound not available');
        }
    }
}

class TooltipSystem {
    constructor() {
        this.setupTooltips();
    }

    setupTooltips() {
        console.log('Setting up tooltips...');
        
        // Find the specific plus button by ID
        const plusBtn = document.getElementById('plusBtn');
        
        if (plusBtn) {
            console.log('Found plus button:', plusBtn);
            console.log('Plus button computed style:', window.getComputedStyle(plusBtn));
            
            // Find the tooltip text in the same container
            const container = plusBtn.closest('.tooltip-container');
            const tooltipText = container ? container.querySelector('.tooltip-text') : null;
            
            if (tooltipText) {
                console.log('Found tooltip text:', tooltipText);
                console.log('Initial tooltip visibility:', tooltipText.style.visibility);
                
                // Ensure tooltip starts hidden
                tooltipText.classList.remove('visible');
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.display = 'none';
                console.log('Tooltip initialized as hidden');
                
                // Add touch-action and ensure button is clickable on mobile
                plusBtn.style.touchAction = 'manipulation';
                plusBtn.style.pointerEvents = 'auto';
                plusBtn.style.cursor = 'pointer';
                plusBtn.style.webkitTapHighlightColor = 'transparent';
                
                // Test that button is responding to any interaction
                plusBtn.addEventListener('mousedown', () => console.log('Mouse down on plus button'));
                plusBtn.addEventListener('touchstart', () => console.log('Touch start on plus button'));
                
                // Simple function to toggle tooltip visibility using CSS classes
                const toggleTooltip = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Plus button triggered!', e.type);
                    
                    // Toggle CSS class and inline styles
                    if (tooltipText.classList.contains('visible')) {
                        // Hide
                        tooltipText.classList.remove('visible');
                        tooltipText.style.visibility = 'hidden';
                        tooltipText.style.display = 'none';
                        console.log('Hiding tooltip');
                    } else {
                        // Show
                        tooltipText.classList.add('visible');
                        tooltipText.style.visibility = 'visible';
                        tooltipText.style.display = 'block';
                        console.log('Showing tooltip');
                    }
                };
                
                // Add both click and touchend events for mobile compatibility
                plusBtn.addEventListener('click', toggleTooltip);
                
                // Separate touchend handler to avoid double-firing
                plusBtn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    console.log('Touch end detected');
                    // Small delay to avoid conflicts with click
                    setTimeout(() => toggleTooltip(e), 10);
                });
            } else {
                console.error('Could not find tooltip text element');
            }
        } else {
            console.error('Could not find plus button with ID "plusBtn"');
        }
    }
}



// Click-to-find game functionality
class ClickToFindGame {
    constructor() {
        this.objectsToFind = ['sculpture', 'canvas', 'firma'];
        this.foundObjects = new Set();
        this.init();
    }

    init() {
        this.setupClickZones();
        this.setupCustomCursor();
        // Don't setup reveal buttons initially - they'll be set up when steps become active
    }

    setupCustomCursor() {
        const artworkFrame = document.querySelector('.artwork-frame');
        const searchCursor = document.getElementById('searchCursor');
        
        if (artworkFrame && searchCursor) {
            artworkFrame.addEventListener('mouseenter', () => {
                searchCursor.style.display = 'block';
            });
            
            artworkFrame.addEventListener('mouseleave', () => {
                searchCursor.style.display = 'none';
            });
            
            artworkFrame.addEventListener('mousemove', (e) => {
                const rect = artworkFrame.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                searchCursor.style.left = x + 'px';
                searchCursor.style.top = y + 'px';
            });
        }
    }

    setupClickZones() {
        this.objectsToFind.forEach(objectName => {
            const clickZone = document.getElementById(`${objectName}-zone`);
            if (clickZone) {
                clickZone.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleObjectClick(objectName);
                });
            }
        });
    }

    handleObjectClick(objectName) {
        if (this.foundObjects.has(objectName)) {
            return; // Already found
        }

        // Mark object as found
        this.foundObjects.add(objectName);
        
        // Update checklist item with cool animation
        const listItem = document.getElementById(`${objectName}-item`);
        if (listItem) {
            listItem.setAttribute('data-found', 'true');
            listItem.classList.add('found-animation');
            
            // Update checkbox
            const checkbox = listItem.querySelector('.checkbox');
            if (checkbox) {
                checkbox.textContent = '●';
                checkbox.style.color = '#87bafa';
            }
            
            // Add strikethrough and color change to text
            const textSpan = listItem.querySelector('span:not(.checkbox)');
            if (textSpan) {
                textSpan.style.textDecoration = 'line-through';
                textSpan.style.color = '#87bafa';
            }
            
            // Remove animation class after animation completes
            setTimeout(() => {
                listItem.classList.remove('found-animation');
            }, 800);
        }

        // Show found indicator
        const foundIndicator = document.getElementById(`found-${objectName}`);
        if (foundIndicator) {
            foundIndicator.style.display = 'block';
        }

        // Hide click zone
        const clickZone = document.getElementById(`${objectName}-zone`);
        if (clickZone) {
            clickZone.style.display = 'none';
        }

        // Play success sound (if you have one)
        this.playSuccessSound();

        // Check if all objects are found
        if (this.foundObjects.size === this.objectsToFind.length) {
            setTimeout(() => {
                this.completeStep1();
            }, 500);
        }
    }

    playSuccessSound() {
        // Optional: Add sound effect
        // const audio = new Audio('assets/success-sound.mp3');
        // audio.play().catch(e => console.log('Could not play sound'));
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    enableMagnifyingGlass() {
        // Enable the magnifying glass functionality
        if (window.magnifyingGlassInstance) {
            window.magnifyingGlassInstance.enable();
        }
    }

    completeStep1() {
        // Show the next button when objects are found
        const nextBtn = document.getElementById('next-to-step-2');
        if (nextBtn) {
            nextBtn.classList.add('show');
            nextBtn.addEventListener('click', () => {
                this.transitionToStep2();
            });
        }
    }

    transitionToStep2() {
        // Update progress bar
        this.updateProgressBar(1, 'completed');
        this.updateProgressBar(2, 'active');
        
        // Fade out step 1
        const step1 = document.getElementById('step-1');
        step1.classList.add('fade-out');
        
        setTimeout(() => {
            step1.classList.remove('active');
            step1.style.display = 'none';
            
            // Show and fade in step 2
            const step2 = document.getElementById('step-2');
            step2.style.display = 'block';
            setTimeout(() => {
                step2.classList.add('active');
            }, 50);
            
            // Setup step 2 reveal button
            this.setupStep2Reveal();
        }, 300);
    }

    setupStep2Reveal() {
        const revealBtn = document.getElementById('reveal-questions');
        if (revealBtn) {
            console.log('Setting up step 2 reveal button');
            // Remove any existing listeners to avoid duplicates
            revealBtn.removeEventListener('click', this.step2Handler);
            
            // Create a bound handler we can remove later
            this.step2Handler = (e) => {
                e.preventDefault();
                console.log('Step 2 reveal button clicked');
                this.handleStep2Reveal();
            };
            
            revealBtn.addEventListener('click', this.step2Handler);
        } else {
            console.error('reveal-questions button not found');
        }
    }

    handleStep2Reveal() {
        const question1Element = document.getElementById('question-1');
        const question2Element = document.getElementById('question-2');
        const question3Element = document.getElementById('question-3');
        
        if (!question1Element || !question2Element || !question3Element) {
            console.error('Question elements not found');
            return;
        }
        
        const question1 = question1Element.value.trim();
        const question2 = question2Element.value.trim();
        const question3 = question3Element.value.trim();
        
        console.log('Question values:', { question1, question2, question3 });
        
        if (!question1 || !question2 || !question3) {
            this.showValidationMessage(document.getElementById('step-2'), 'Por favor, responde todas las preguntas antes de revelar.');
            return;
        }
        
        // Show all answers
        const answersContainer = document.querySelector('#step-2 .answers-container');
        answersContainer.innerHTML = `
            <div class="revealed-answer">${question1}</div>
            <div class="revealed-answer">${question2}</div>
            <div class="revealed-answer">${question3}</div>
        `;
        answersContainer.style.display = 'flex';
        
        // Hide inputs and button
        document.querySelectorAll('#step-2 .magic-input').forEach(input => {
            input.style.display = 'none';
        });
        document.getElementById('reveal-questions').style.display = 'none';
        
        // Show next button after revealing answers
        const nextBtn = document.getElementById('next-to-step-3');
        if (nextBtn) {
            nextBtn.classList.add('show');
            nextBtn.addEventListener('click', () => {
                this.transitionToStep3();
            });
        }
    }

    transitionToStep3() {
        // Update progress bar
        this.updateProgressBar(2, 'completed');
        this.updateProgressBar(3, 'active');
        
        // Fade out step 2
        const step2 = document.getElementById('step-2');
        step2.classList.add('fade-out');
        
        setTimeout(() => {
            step2.classList.remove('active');
            step2.style.display = 'none';
            
            // Show and fade in step 3
            const step3 = document.getElementById('step-3');
            step3.style.display = 'block';
            setTimeout(() => {
                step3.classList.add('active');
            }, 50);
            
            // Setup step 3 reveal button
            this.setupStep3Reveal();
        }, 300);
    }

    setupStep3Reveal() {
        const revealBtn = document.getElementById('reveal-multiple-choice');
        if (revealBtn) {
            revealBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleStep3Reveal();
            });
        }
    }

    handleStep3Reveal() {
        const selectedRadio = document.querySelector('#step-3 input[type="radio"]:checked');
        const correctAnswer = 'todas';
        
        if (!selectedRadio) {
            this.showValidationMessage(document.getElementById('step-3'), 'Por favor, selecciona una opción.');
            return;
        }
        
        const isCorrect = selectedRadio.value === correctAnswer;
        const answersContainer = document.querySelector('#step-3 .answers-container');
        
        if (isCorrect) {
            answersContainer.innerHTML = '<div class="revealed-answer correct">¡Correcto! ✓ Todas las opciones son válidas.</div>';
        } else {
            const selectedText = selectedRadio.nextElementSibling.textContent;
            answersContainer.innerHTML = `
                <div class="revealed-answer user-attempt">Has elegido: "${selectedText}"</div>
                <div class="revealed-answer correct">La respuesta correcta es: "Todas son correctas" ✓</div>
            `;
        }
        answersContainer.style.display = 'flex';
        
        // Disable multiple choice and hide button
        document.querySelectorAll('#step-3 input[type="radio"]').forEach(radio => radio.disabled = true);
        document.getElementById('reveal-multiple-choice').style.display = 'none';
        
        // Show final completion button
        console.log('Old system: showing finalizar button');
        const completeBtn = document.getElementById('complete-experience');
        if (completeBtn) {
            console.log('Old system: found finalizar button');
            completeBtn.classList.add('show');
            completeBtn.style.display = 'inline-block'; // Force display
            completeBtn.addEventListener('click', () => {
                console.log('Old system: finalizar clicked');
                this.completeStep3();
            });
        } else {
            console.error('Old system: finalizar button not found!');
        }
    }

    completeStep3() {
        // Update progress bar
        this.updateProgressBar(3, 'completed');
        
        // Show inline review with all answers
        this.showInlineReview();
    }

    showInlineReview() {
        // Create confetti effect
        this.createConfetti();
        
        // Collect all answers
        const question1 = document.getElementById('question-1').value.trim();
        const question2 = document.getElementById('question-2').value.trim();
        const question3 = document.getElementById('question-3').value.trim();
        const selectedRadio = document.querySelector('#step-3 input[type="radio"]:checked');
        
        // Replace the left column content with review
        const leftCol = document.querySelector('.left-col');
        
        let selectedText = '';
        let isCorrect = false;
        if (selectedRadio) {
            selectedText = selectedRadio.nextElementSibling.textContent;
            isCorrect = selectedRadio.value === 'todas';
        }
        
        const reviewHTML = `
            <h1>UNA HABITACIÓN CON VISTAS</h1>
            <div class="answers-review-section">
                <h3>¡Experiencia completada!</h3>
                <div class="review-list">
                    <div class="review-item">
                        <strong>Objetos encontrados</strong>
                        <p>✓ Prismáticos y pluma</p>
                    </div>
                    <div class="review-item">
                        <strong>¿Para qué servirán los prismáticos?</strong>
                        <p>${question1}</p>
                    </div>
                    <div class="review-item">
                        <strong>¿De qué pájaro podría ser la pluma?</strong>
                        <p>${question2}</p>
                    </div>
                    <div class="review-item">
                        <strong>¿Qué aporta el fondo neutro?</strong>
                        <p>${question3}</p>
                    </div>
                    <div class="review-item">
                        <strong>Tu respuesta final:</strong>
                        <p>${selectedText} ${isCorrect ? '✓' : ''}</p>
                        ${!isCorrect ? '<p><strong>Respuesta correcta:</strong> Todas son correctas ✓</p>' : ''}
                    </div>
                </div>
            </div>
        `;
        
        leftCol.innerHTML = reviewHTML;
        this.enableMagnifyingGlass();
    }
    
    createConfetti() {
        const confettiContainer = document.getElementById('confettiContainer');
        const colors = ['#87bafa', '#82c7b2', '#c4e0ff', '#b5f0de', '#fad4fc', '#c2b2ff'];
        
        // Create burst from center of screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < 40; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Position at center
            confetti.style.left = centerX + 'px';
            confetti.style.top = centerY + 'px';
            
            // Random direction and distance for burst - much bigger
            const angle = (i / 40) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
            const distance = 400 + Math.random() * 500;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            confetti.style.setProperty('--dx', dx + 'px');
            confetti.style.setProperty('--dy', dy + 'px');
            
            confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 1500);
        }
    }

    updateProgressBar(step, status) {
        const stepElement = document.querySelector(`[data-step="${step}"]`);
        if (stepElement) {
            stepElement.classList.remove('active', 'completed');
            stepElement.classList.add(status);
        }
    }

    // This method is no longer needed - buttons are set up individually for each step

    handleRevealClick(button, questionIndex) {
        const responseSection = button.closest('.response-section');
        const answersContainer = responseSection.querySelector('.answers-container');
        const input = responseSection.querySelector('.magic-input');
        
        if (!input || !input.value.trim()) {
            // Show validation message
            this.showValidationMessage(responseSection, 'Por favor, escribe una respuesta antes de revelar.');
            return;
        }

        const userResponse = input.value.trim();
        
        if (answersContainer) {
            // Create sparkle effect
            this.createSparkleEffect(responseSection);
            
            // Show the user's response with cool animation
            answersContainer.innerHTML = `<div class="revealed-answer magic-reveal">${userResponse}</div>`;
            answersContainer.style.display = 'block';
            
            // Hide the input and button with fade out
            input.style.transition = 'opacity 0.3s ease';
            input.style.opacity = '0';
            setTimeout(() => {
                input.style.display = 'none';
            }, 300);
            
            button.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            button.style.opacity = '0';
            button.style.transform = 'scale(0.8)';
            setTimeout(() => {
                button.style.display = 'none';
            }, 300);
            
            // Add magic reveal animation
            const revealedAnswer = answersContainer.querySelector('.revealed-answer');
            if (revealedAnswer) {
                setTimeout(() => {
                    revealedAnswer.classList.add('magic-reveal');
                }, 400);
            }
        }
    }

    showValidationMessage(container, message) {
        // Remove existing validation message
        const existingMessage = container.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new validation message
        const validationDiv = document.createElement('div');
        validationDiv.className = 'validation-message';
        validationDiv.textContent = message;
        validationDiv.style.color = '#ff6b6b';
        validationDiv.style.fontSize = '14px';
        validationDiv.style.marginTop = '10px';
        validationDiv.style.textAlign = 'center';
        validationDiv.style.opacity = '0';
        validationDiv.style.transition = 'opacity 0.3s ease';

        container.appendChild(validationDiv);

        // Fade in the message
        setTimeout(() => {
            validationDiv.style.opacity = '1';
        }, 10);

        // Remove message after 3 seconds
        setTimeout(() => {
            validationDiv.style.opacity = '0';
            setTimeout(() => {
                if (validationDiv.parentNode) {
                    validationDiv.parentNode.removeChild(validationDiv);
                }
            }, 300);
        }, 3000);
    }

    createSparkleEffect(container) {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.className = 'sparkle-container';
        container.appendChild(sparkleContainer);
        
        // Create multiple sparkles
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                
                // Random position around the container
                const x = Math.random() * 200 - 100;
                const y = Math.random() * 100 - 50;
                
                sparkle.style.left = `50%`;
                sparkle.style.top = `50%`;
                sparkle.style.transform = `translate(${x}px, ${y}px)`;
                
                sparkleContainer.appendChild(sparkle);
                
                // Remove sparkle after animation
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 1500);
            }, i * 100);
        }
        
        // Remove sparkle container after all animations
        setTimeout(() => {
            if (sparkleContainer.parentNode) {
                sparkleContainer.parentNode.removeChild(sparkleContainer);
            }
        }, 2000);
    }

    // Method to reset the game (optional)
    resetGame() {
        this.foundObjects.clear();
        
        // Reset all checklist items
        this.objectsToFind.forEach(objectName => {
            const listItem = document.getElementById(`${objectName}-item`);
            if (listItem) {
                listItem.setAttribute('data-found', 'false');
                const checkbox = listItem.querySelector('.checkbox');
                if (checkbox) {
                    checkbox.textContent = '☐';
                    checkbox.style.color = '';
                }
                
                // Remove strikethrough and reset color for text
                const textSpan = listItem.querySelector('span:not(.checkbox)');
                if (textSpan) {
                    textSpan.style.textDecoration = 'none';
                    textSpan.style.color = '';
                }
            }
            
            // Hide found indicators
            const foundIndicator = document.getElementById(`found-${objectName}`);
            if (foundIndicator) {
                foundIndicator.style.display = 'none';
            }
            
            // Show click zones
            const clickZone = document.getElementById(`${objectName}-zone`);
            if (clickZone) {
                clickZone.style.display = 'block';
            }
        });
        
        // Hide success modal
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'none';
        }

        // Disable magnifying glass again
        if (window.magnifyingGlassInstance) {
            window.magnifyingGlassInstance.disable();
        }
    }
}

// Initialize the systems when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.magnifyingGlassInstance = new MagnifyingGlass();
    const answerSystem = new AnswerRevealSystem();
    window.answerSystemInstance = answerSystem;
    const tooltipSystem = new TooltipSystem();
    const clickToFindGame = new ClickToFindGame();
    
    // Handle success modal close button
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            const modal = document.getElementById('successModal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Handle mobile layout
    
    
    // Optional: Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('successModal');
            if (modal && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        }
        
        // Reset game with 'R' key (for testing)
        if (e.key === 'r' || e.key === 'R') {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                clickToFindGame.resetGame();
            }
        }
    });

    // Handle Enter key in input fields
    const inputs = document.querySelectorAll('.magic-input');
    inputs.forEach((input, index) => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const revealBtn = input.parentElement.querySelector('.reveal-btn');
                if (revealBtn) {
                    revealBtn.click();
                }
            }
        });
    });
});

// Additional utility functions
function showHint(objectName) {
    const clickZone = document.getElementById(`${objectName}-zone`);
    if (clickZone && !clickZone.style.display === 'none') {
        clickZone.style.border = '3px solid #ffc107';
        clickZone.style.backgroundColor = 'rgba(255, 193, 7, 0.2)';
        
        setTimeout(() => {
            clickZone.style.border = '2px solid transparent';
            clickZone.style.backgroundColor = 'transparent';
        }, 2000);
    }
}

document.addEventListener('mouseover', (e) => {
    // Detectamos si el mouse entra en una opción de color
    const option = e.target.closest('.choice-option');
    if (!option) return;

    // Buscamos el radio button dentro de esa opción
    const input = option.querySelector('input[name="colorChoice"]');
    if (!input) return;

    // Activamos la capa correspondiente
    if (input.value === 'gris') {
        document.getElementById('layer-gris').style.opacity = '1';
    } else if (input.value === 'rojo') {
        document.getElementById('layer-rojo').style.opacity = '1';
    }
});

document.addEventListener('mouseout', (e) => {
    // Cuando el mouse sale de la opción, reseteamos la opacidad
    const option = e.target.closest('.choice-option');
    if (option) {
        document.getElementById('layer-gris').style.opacity = '0';
        document.getElementById('layer-rojo').style.opacity = '0';
    }
});
// Función autoejecutable para evitar conflictos
(function() {
    const setupColorHover = () => {
        const options = document.querySelectorAll('.choice-option');
        
        options.forEach(option => {
            const radio = option.querySelector('input[name="colorChoice"]');
            if (!radio) return;

            const color = radio.value; // "gris" o "rojo"

            option.addEventListener('mouseenter', () => {
                document.body.classList.add(`show-${color}`);
            });

            option.addEventListener('mouseleave', () => {
                document.body.classList.remove(`show-${color}`);
            });
        });
    };

    // Ejecutar inmediatamente y también cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupColorHover);
    } else {
        setupColorHover();
    }
})();