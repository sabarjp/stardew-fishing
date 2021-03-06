import React, { useState } from 'react';
import Locations from './Locations';
import Weather from './Weather';
import Seasons from './Seasons';
import Baits from './Baits';
import Tackle from './Tackle';
import { convertXpToLevel } from './CalcTools';
import SimulationForm from './SimulationForm';
import FishingLog from './FishingLog';
import './App.css';
import FishingSummary from './FishingSummary';
import 'twin.macro';
import 'styled-components/macro';

function App() {
  // inputs
  const [dayStart, setDayStart] = useState(600);
  const [dayEnd, setDayEnd] = useState(2200);
  const [timeInDay, setTimeInDay] = useState(0);
  const [startingFishXp, setStartingFishXp] = useState(0);
  const [fishingArea, setFishingArea] = useState(Locations.MOUNTAIN_LAKE);
  const [season, setSeason] = useState(Seasons.SPRING);
  const [weather, setWeather] = useState(Weather.SUNNY);
  const [fishingTackle, setFishingTackle] = useState(Tackle.NONE);
  const [fishingBait, setFishingBait] = useState(Baits.NONE);
  const [startingEnergy, setStartingEnergy] = useState(270);
  const [usingTrainingRod, setUsingTrainingRod] = useState(false);
  const [catchLegendaryFish, setCatchLegendaryFish] = useState(false);
  const [extendedFamilyQuestActive, setExtendedFamilyQuestActive] = useState(false);
  // outputs
  const [endingFishXp, setEndingFishXp] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [fishingLog, setFishingLog] = useState([]);
  const [keptFish, setKeptFish] = useState([]);

  const extraInfo = keptFish.length > 0 && (
    <div>
      <p className="lvl">
        Lvl/Xp: {convertXpToLevel(endingFishXp)}/{Math.round(endingFishXp)}
      </p>
      <p className="time-in-day">Time in day: {timeInDay}</p>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <SimulationForm
          dayStart={dayStart}
          setDayStart={setDayStart}
          dayEnd={dayEnd}
          setDayEnd={setDayEnd}
          timeInDay={timeInDay}
          setTimeInDay={setTimeInDay}
          startingFishXp={startingFishXp}
          setStartingFishXp={setStartingFishXp}
          fishingArea={fishingArea}
          setFishingArea={setFishingArea}
          season={season}
          setSeason={setSeason}
          weather={weather}
          setWeather={setWeather}
          fishingTackle={fishingTackle}
          setFishingTackle={setFishingTackle}
          fishingBait={fishingBait}
          setFishingBait={setFishingBait}
          startingEnergy={startingEnergy}
          setStartingEnergy={setStartingEnergy}
          usingTrainingRod={usingTrainingRod}
          setUsingTrainingRod={setUsingTrainingRod}
          setEndingFishXp={setEndingFishXp}
          setFishingLog={setFishingLog}
          setKeptFish={setKeptFish}
          catchLegendaryFish={catchLegendaryFish}
          setCatchLegendaryFish={setCatchLegendaryFish}
          extendedFamilyQuestActive={extendedFamilyQuestActive}
          setExtendedFamilyQuestActive={setExtendedFamilyQuestActive}
          pauseGame={false}
        />

        <FishingSummary fish={keptFish} />

        {/**<FishingLog 
    fishingLog={fishingLog}
    keptFish={keptFish}
    />*/}
        {extraInfo}
      </header>
    </div>
  );
}

export default App;
