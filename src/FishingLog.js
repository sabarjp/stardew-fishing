import React from 'react';
import Quality from './Quality';
import { determineValue } from './CalcTools';
import './FishingLog.css';
import 'twin.macro';

function FishingLog({ fishingLog, keptFish }) {
	const prettyFormatFish = (fish) => {
		let qualityIndicator = '';

		if (fish.quality === Quality.SILVER)
			qualityIndicator = (
				<span className='Silver-Quality-Image Quality-Icon'></span>
			);
		if (fish.quality === Quality.GOLD)
			qualityIndicator = (
				<span className='Gold-Quality-Image Quality-Icon'></span>
			);
		if (fish.quality === Quality.IRIDIUM)
			qualityIndicator = (
				<span className='Iridium-Quality-Image Quality-Icon'></span>
			);

		return (
			<div>
				{fish.name}
				<div
					className={`${fish.name
						.replaceAll(' ', '-')
						.replaceAll('.', '')}-Image Item-Icon`}
				>
					{qualityIndicator}
				</div>
			</div>
		);
	};

	const prettyFormatGold = (goldAmount) => {
		if (isNaN(goldAmount)) return '';

		return (
			<div>
				{Math.round(goldAmount)}
				<span className='Gold-Image Gold-Icon'></span>
			</div>
		);
	};

	return (
		<div className='fishingLog'>
			<div>
				<span tw=''>Fishing Log:</span>
				{fishingLog.map((logItem, ndx) => {
					switch (logItem.type) {
						case 'catch':
							return (
								<div className='logEntry' key={ndx}>
									<div>{parseInt(logItem.time)}</div>
									<div>{prettyFormatFish(logItem.fish)}</div>
									<div>
										{prettyFormatGold(
											determineValue(
												logItem.fish.baseValue,
												logItem.fish.quality,
											),
										)}
									</div>
								</div>
							);
						case 'ate':
							return (
								<div className='logEntry' key={ndx}>
									<div>{parseInt(logItem.time)}</div>
									<div>Ate</div>
									<div>{prettyFormatFish(logItem.fish)}</div>
								</div>
							);
						default:
							return <div className='logEntry' key={ndx}></div>;
					}
				})}
			</div>

			<div>
				Total:
				{keptFish.length > 0 &&
					keptFish
						.map((fish) =>
							determineValue(fish.baseValue, fish.quality),
						)
						.filter((value) => !isNaN(value))
						.reduce((prev, cur) => prev + cur)}
				<span className='Gold-Icon Gold-Image'></span>
			</div>
		</div>
	);
}

FishingLog.propTypes = {
  fishingLog: PropTypes.array,
  keptFish: PropTypes.array,
};

export default FishingLog;
