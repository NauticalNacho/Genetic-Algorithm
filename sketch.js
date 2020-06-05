/*eslint-env es6*/ 

var target;
var targetArray = [];
var maxPop = 250;   
var population = [];
var matingPool = [];
var mutationRate = 0.02;
var highestFitness = 0;
var averageFitness = 0;
var generation = 0;

var success = false;
var start = false;

//HTML elements
var targetHTML;
var bestPhraseHTML;
var averageFitnessHTML;
var generationHTML;
var mutationRateHTML;
var populationHTML;

var mutationRateSlider;
var populationSlider;

var startButton;
var inputBox;

function setup() {   
    
    targetHTML = createP();
    
    inputBox = createInput("Enter target text here");
    inputBox.input(onInput);
    
    bestPhraseHTML = createP();
    averageFitnessHTML = createP();
    generationHTML = createP();
    
    mutationRateHTML = createP();
    mutationRateSlider = createSlider(0, 50, 3);
    
    populationHTML = createP();
    populationSlider = createSlider(100, 10000, 250);
    
    createP();
    startButton = createButton("Start");
    startButton.mousePressed(startSim);
}

function draw() {
    
    if (start == false) {
        mutationRate = (mutationRateSlider.value())/100;
        maxPop = populationSlider.value();
    }
    
    if (success == false && start == true) {
        generation++;
        buildMatingPool();
        reproduce();
    }
    displayHTML();
}

function initPop() {
    for (var i = 0; i != maxPop; i++) {
        population[i] = new DNA(false);
        population[i].generateOutput();
        population[i].calcFitness();
    } 
}

class DNA {
    constructor(child) {
        
        this.genes = [];
        this.output = "";
        this.fitness = 0;
        
        //Generating starting gene pool
        if (child == false) {
            for (var i = 0; i != target.length; i++) {
                this.genes[i] = String.fromCharCode(floor(random(32,126)));
            }
        }
    }
    
    generateOutput() {
        for (var i = 0; i != this.genes.length; i++) {
            this.output = this.output + this.genes[i];
        }
    }
    
    calcFitness() {
        for (var i = 0; i != target.length; i++) {
            if (this.genes[i] == targetArray[i]) {
                this.fitness += 1;
            }
        }
    }
}

function buildMatingPool() {
    matingPool = [];
    
    for (var i = 0; i != population.length; i++) {
        for (var j = 0; j != population[i].fitness; j++) {
            matingPool.push(population[i]);
        }
        averageFitness+= population[i].fitness;
    }
    averageFitness = averageFitness/population.length;
}

function reproduce() {
    population = [];
    
    for (var j = 0; j != maxPop; j++) {
        var partner1 = matingPool[floor(random(0, matingPool.length))];
        var partner1Genes = round(target.length/2);

        var partner2 = matingPool[floor(random(0, matingPool.length))];

        var child = new DNA(true);

        for (var i=0; i != partner1Genes; i++) {
            child.genes.push(partner1.genes[i]);
        }
        for (i= partner1Genes; i != target.length; i++) {
            child.genes.push(partner2.genes[i]);
        }

        //Mutation
        for (i=0; i != target.length; i++) {
            if (random(0,1) <= mutationRate) {
                child.genes[i] = String.fromCharCode(floor(random(32,126)));
            }
        }


        child.generateOutput();
        child.calcFitness();
        
        evaluateFitness(child);
        
        //Add child to new population
        population.push(child);
    }
}

function evaluateFitness(DNA) {
    if (DNA.fitness >= highestFitness.fitness) {
        highestFitness = DNA;
    }
    if (DNA.output == target) {
        success = true;
    }
}

function displayHTML() {
    targetHTML.html("Target: " + target);
    bestPhraseHTML.html("Highest fitness: " + highestFitness.output);
    averageFitnessHTML.html("Average fitness: " + round(averageFitness, 3));
    generationHTML.html("Current generation: " + generation);
    mutationRateHTML.html("Mutation Rate: " + mutationRate*100 + "%");
    populationHTML.html("Maximum Population Size: " + maxPop);
}

function startSim() {
    start = true;
    initPop();
    highestFitness = population[0];
}

function onInput() {
    target = this.value();
    targetArray = split(target, "");
}