import React from 'react';
import Quality from './Quality';
import {determineValue} from './CalcTools';
import './FishingSummary.css';

function FishingSummary({ fish }) {
  const prettyFormatFish = (fish) => {
    let qualityIndicator = "";

    if (fish.quality === Quality.SILVER)
      qualityIndicator = <span className="Silver-Quality-Image Quality-Icon"></span>
    if (fish.quality === Quality.GOLD)
      qualityIndicator = <span className="Gold-Quality-Image Quality-Icon"></span>
    if (fish.quality === Quality.IRIDIUM)
      qualityIndicator = <span className="Iridium-Quality-Image Quality-Icon"></span>

    return (
      <div className={`${fish.name.replace(" ", "-")}-Image Item-Icon`}>
        {qualityIndicator}
      </div>
    )
  }

  const prettyFormatGold = (goldAmount) => {
    if (isNaN(goldAmount)) return "";

    return <div>{Math.round(goldAmount)}<span className="Gold-Image Gold-Icon"></span></div>
  }

  return (
    <div className="fishingSummary">
        <div className="summaryGrid">
          Fishing Summary: 
          {fish.map((fish, ndx) => {
              return (
                <div className="summaryEntry" key={ndx}>
                  <div>{prettyFormatFish(fish)}</div>
                  <div>{prettyFormatGold(determineValue(fish.baseValue, fish.quality))}</div>
                </div>
              )
          })}
        </div>

        <div>
          Total: 
          {fish.length > 0 && fish
            .map((fish) => determineValue(fish.baseValue, fish.quality))
            .filter((value) => !isNaN(value))
            .reduce((prev, cur) => prev + cur)
          }
          <span className="Gold-Icon Gold-Image"></span>
        </div>
    </div>
  );
}

export default FishingSummary;
