import React, {useEffect} from 'react';
import Fish from './Fish';
import {baseLocations} from './Locations';
import Weather from './Weather';
import Seasons from './Seasons';
import Baits from './Baits';
import Tackle from './Tackle';
import Quality from './Quality';
import {shuffleArray} from './Utils';
import {convertXpToLevel, determineBaseFishQuality, determineCastDepth, 
    determineEnergyHealth, findHighestEnergyPerGold, upgradeQuality} from './CalcTools';
import './SimulationForm.css';

function SimulationForm({ dayStart, setDayStart, dayEnd, setDayEnd, timeInDay, setTimeInDay,
    startingFishXp, setStartingFishXp, fishingArea, setFishingArea, season, setSeason, weather, setWeather,
    fishingTackle, setFishingTackle, fishingBait, setFishingBait, startingEnergy, setStartingEnergy,
    usingTrainingRod, setUsingTrainingRod, setEndingFishXp, setFishingLog, setKeptFish, 
    catchLegendaryFish, setCatchLegendaryFish, extendedFamilyQuestActive, setExtendedFamilyQuestActive }) {

    useEffect(() => {
      const updateTimeInDay = () => {
        let timeInDay = (dayEnd - dayStart) * 0.6;
        setTimeInDay(timeInDay);
      }
  
      updateTimeInDay();
    }, [dayStart, dayEnd, setTimeInDay])

  const onTrainingRodChanged = (e) => {
    setUsingTrainingRod(e.target.checked);
  }

  const onCatchLegendaryChanged = (e) => {
    setCatchLegendaryFish(e.target.checked);
  }

  const onExtendedFamilyActiveChanged = (e) => {
    setExtendedFamilyQuestActive(e.target.checked);
  }

  const onStartingEnergyChanged = (e) => {
    let value = parseInt(e.target.value, 10);
    if (value === undefined || isNaN(value)) 
      value = 0;
    setStartingEnergy(value);
  }

  const onStartingFishXpChanged = (e) => {
    let value = parseInt(e.target.value, 10);
    if (value === undefined || isNaN(value)) 
      value = 0;
    setStartingFishXp(value);
  }

  const onDayStartChanged = (e) => {
    let value = parseInt(e.target.value, 10);
    if (value === undefined || isNaN(value)) 
      value = 0;
    setDayStart(value);
  }

  const onDayEndChanged = (e) => {
    let value = parseInt(e.target.value, 10);
    if (value === undefined || isNaN(value))
      value = 0;
    setDayEnd(value);
  }

  const onSimulate = () => {
    let timeToSimulate = timeInDay;
    let liveFishingXp = startingFishXp;
    let liveEnergy = startingEnergy;
    let caughtFishes = [];
    let newFishingLog = [];
    let caughtLegendaryFish = {};

    while(timeToSimulate > 0) {
      let fishingLevel = convertXpToLevel(liveFishingXp);
      let energyCost = 8 - (0.1 * fishingLevel);
      let castDepth = determineCastDepth(fishingLevel, fishingArea);

      // regain energy if needed
      if (liveEnergy < energyCost && caughtFishes.length > 0) {
        const fishToEatNdx = findHighestEnergyPerGold(caughtFishes);

        if (fishToEatNdx === -1) {
          // nothing to eat, can't fish anymore!
          timeToSimulate = 0;
          break;
        }

        const fishToEat = caughtFishes.splice(fishToEatNdx, 1)[0];
        const energyGain = determineEnergyHealth(fishToEat.baseEnergy, fishToEat.quality);
        liveEnergy += energyGain;
        timeToSimulate -= 1;
        newFishingLog.push({time: (dayEnd - (timeToSimulate/0.6)), type: "ate", fish: {...fishToEat}, energy: energyGain})
      }

      // cast
      liveEnergy -= energyCost;
      timeToSimulate -= 2;

      // wait random time between 0.6 and 30
      let maxNibbleTime = 30;
      // ...reduced by fishing level
      maxNibbleTime -= (0.25 * fishingLevel);
      // ...reduced by tackle
      if (fishingTackle === Tackle.SPINNER) 
        maxNibbleTime -= 5;
      if (fishingTackle === Tackle.DRESSED_SPINNER)
        maxNibbleTime -= 10;

      let timeToNibble = Math.random() * (maxNibbleTime - 0.6) + 0.6;

      // time to nibble modifiers
      // ...reduced by being first cast
      timeToNibble *= 0.75;
      // ...reduced by bait
      if (fishingBait === Baits.BAIT)
        timeToNibble *= 0.5;
      if (fishingBait === Baits.MAGNET)
        timeToNibble *= 0.5;
      if (fishingBait === Baits.WILD)
        timeToNibble *= 0.375;
      // ...never below 0.5
      if (timeToNibble < 0.5)
        timeToNibble = 0.5;
      // ...reduced by bubbles
      // TODO: BUBBLES 0.25x multiplier
      
      // simulate the actual wait time
      timeToSimulate -= timeToNibble;

      // CHOOSE FISH
      // ...create spawn set
      let spawns = [];
      for (let fish of Fish) {
        // exclude legendary fish already caught
        if (caughtLegendaryFish[fish.id]) {
          continue;
        }
        // exclude legendary fish if not looking for them
        if (!catchLegendaryFish && fish.legendary) {
          continue;
        }
        // excluded extended legendary fish if not looking for them
        if (!extendedFamilyQuestActive && fish.extendedFamily) {
          continue;
        }

        // check for ability to catch (training rod + not adv fish, required level)
        if (((usingTrainingRod && fish.difficulty < 50) || !usingTrainingRod) && fishingLevel >= fish.requiredLevel) {
          // check for proper location, weather
          // TODO: special case for night market
          if ((fishingArea & fish.location) && (weather & fish.weather)) {
            // now check for season, unless its ginger island or the night market
            if ((fishingArea & (baseLocations.GINGER_ISLAND | baseLocations.NIGHT_MARKET)) || (season & fish.seasons)) {
              // check for proper time
              for (let i=0; i<fish.time.length; i=i+2) {
                let minTime = fish.time[i];
                let maxTime = fish.time[i+1];
                if ((dayEnd - (timeToSimulate/0.6)) >= minTime && (dayEnd - (timeToSimulate/0.6)) <= maxTime) {
                  // this is a possible spawn
                  spawns.push(fish);
                  break;
                }
              }
            }
          }
        }
      }

      // ...shuffle spawns
      spawns = shuffleArray(spawns);

      // ...skill check against each possible spawn
      let caughtFish = {name: "Trash", difficulty: 0, quality: Quality.NONE, baseValue: 0};
      for (let fish of spawns) {
        let odds = Math.min(0.90, fish.spawnMultiplier - Math.max(0, fish.bestDepth - castDepth) * fish.depthMultiplier * fish.spawnMultiplier + (fishingLevel / 50));
        if (Math.random() < odds) {
          caughtFish = {...fish};
          // keep legendary fish out of future spawn pools
          if (fish.legendary) {
            caughtLegendaryFish[caughtFish.id] = true;
          }
          break;
        }
      }

      // ...determine quality
      let fishQuality = determineBaseFishQuality(fishingLevel, castDepth);
      // ...modify quality
      if (fishingTackle === Tackle.QUALITY_BOBBER) {
        fishQuality = upgradeQuality(fishQuality);
      }
      // ...perfect catch?
      let perfectChance = (caughtFish.difficulty - ((usingTrainingRod ? 5 : fishingLevel) * 2.5)) / 100;
      let perfectCatch = Math.random() > perfectChance;
      if (perfectCatch) {
        fishQuality = upgradeQuality(fishQuality);
      }

      // ...downgrade quality for special cases, i.e. training rod and garbage
      if (["Trash", "Green Algae", "White Algae", "Seaweed"].includes(caughtFish.name))
        fishQuality = Quality.NORMAL;
      if (usingTrainingRod)
        fishQuality = Quality.NORMAL;

      // abusing dynamic typing for ease of use
      caughtFish.quality = fishQuality;

      // CHOOSE TREASURE
      // TODO

      // reel in time
      timeToSimulate -= 2

      // XP
      let xpGain = 3 + (3 * caughtFish.quality) + (1/3 * caughtFish.difficulty);
      if (perfectCatch)
        xpGain *= 2.4;
      liveFishingXp += xpGain;

      // LAND FISH
      newFishingLog.push({time: (dayEnd - (timeToSimulate/0.6)), type: "catch", fish: {...caughtFish}})
      console.log("caught " + caughtFish.name + " " + caughtFish.quality);
      caughtFishes.push(caughtFish);

      // LAND TREASURE
    }

    setFishingLog(newFishingLog);
    setKeptFish(caughtFishes);
    setEndingFishXp(liveFishingXp);
  };

  // TODO: add tooltips to fields and fish
  return (
    <div className="simulationForm">
      <div className="formItem">
        <label htmlFor="dayStart">Day Start</label>
        <input id="dayStart" type="text" placeholder="0600" onChange={onDayStartChanged} value={dayStart}/>
      </div>
      <div className="formItem">
        <label htmlFor="dayEnd">Day End</label>
        <input id="dayEnd" type="text" placeholder="2200" onChange={onDayEndChanged} value={dayEnd}/>
      </div>
      <div className="formItem">
        <label htmlFor="startingEnergy">Energy</label>
        <input id="startingEnergy" type="text" placeholder="270" onChange={onStartingEnergyChanged} value={startingEnergy}/>
      </div>
      <div className="formItem">
        <label htmlFor="startingFishXp">Fish Xp</label>
        <input id="startingFishXp" type="text" placeholder="0" onChange={onStartingFishXpChanged} value={startingFishXp}/>
        <span>Lv. {convertXpToLevel(startingFishXp)} Fishing</span>
      </div>
      <div className="formItem">
        <label htmlFor="seasonSelect">Season</label>
        <select id="seasonSelect" onChange={ e => setSeason(e.target.value) }>
          {Object.entries(Seasons).map(
            ([key, value]) => <option value={value}>{key}</option>
          )}
        </select>
      </div>
      <div className="formItem">
        <label htmlFor="locationSelect">Location</label>
        <select id="locationSelect" onChange={ e => setFishingArea(e.target.value) }>
          {Object.entries(baseLocations).map(
            ([key, value]) => <option value={value}>{key}</option>
          )}
        </select>
      </div>
      <div className="formItem">
        <label htmlFor="weatherSelect">Weather</label>
        <select id="weatherSelect" onChange={ e => setWeather(e.target.value) }>
          {Object.entries(Weather).map(
            ([key, value]) => <option value={value}>{key}</option>
          )}
        </select>
      </div>
      <div className="formItem">
        <label htmlFor="tackleSelect">Tackle</label>
        <select id="tackleSelect" onChange={ e => setFishingTackle(e.target.value) }>
          {Object.entries(Tackle).map(
            ([key, value]) => <option value={value}>{key}</option>
          )}
        </select>
      </div>
      <div className="formItem">
        <label htmlFor="baitSelect">Bait</label>
        <select id="baitSelect" onChange={ e => setFishingBait(e.target.value) }>
          {Object.entries(Baits).map(
            ([key, value]) => <option value={value}>{key}</option>
          )}
        </select>
      </div>
      <div className="formItem">
        <label htmlFor="trainingRod">T. rod?</label>
        <input id="trainingRod" type="checkbox" onChange={onTrainingRodChanged} checked={usingTrainingRod}/>
      </div>
      <div className="formItem">
        <label htmlFor="catchLegendary">Legendary?</label>
        <input id="catchLegendary" type="checkbox" onChange={onCatchLegendaryChanged} checked={catchLegendaryFish}/>
      </div>
      <div className="formItem">
        <label htmlFor="extendedFamily">Extended family?</label>
        <input id="extendedFamily" type="checkbox" onChange={onExtendedFamilyActiveChanged} checked={extendedFamilyQuestActive}/>
      </div>
      <div className="formItem">
        <input type="button" value="Simulate" onClick={onSimulate}/>
      </div>
    </div>
  );
}

export default SimulationForm;
