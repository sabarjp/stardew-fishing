import React, { useEffect, useState } from 'react';
import Quality from './Quality';
import { determineValue } from './CalcTools';
// import './FishingSummary.css';
import 'twin.macro';
import 'styled-components/macro';

function FishingSummary({ fish }) {
	const [stackableFish, setStackableFish] = useState([]);

	useEffect(() => {
		let arrFish = [];
		let counts = {};

		fish.forEach(function (x) {
			let ndx = `${x.name}-${x.quality}`;
			counts[ndx] = (counts[ndx] || 0) + 1;
		});

		for (const [key, value] of Object.entries(counts)) {
			// name count quality in OBJECTs that are in ARR

			// split object key into arrays of [name, quality]
			let arrNdx = key.split('-');

			// compile an object with name, count, quality props
			// and add it to an array of objects
			arrFish.push({
				name: arrNdx[0],
				count: parseInt(value),
				quality: parseInt(arrNdx[1]),
			});
		}

		// set stackableFish state using arranged data
		setStackableFish(arrFish);
	}, [fish]);

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

		// debugger;

		return (
			<div className={`${fish.name.replace(' ', '-')}-Image Item-Icon`}>
				{qualityIndicator}
				<span className='Amount-Icon'>{`${fish.count}`}</span>
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

	if (fish.length === 0) {
		return <div></div>;
	}

	return (
		<div className='fishingSummary'>
			<h1 tw=''>Fishing Summary:</h1>
			<div tw='flex'>
				{stackableFish.map((stackableFish, ndx) => {
					return (
						<div tw='text-blue-800 bg-red-50 border-4' key={ndx}>
							<div>{prettyFormatFish(stackableFish)}</div>
							{/* <div>{prettyFormatGold(determineValue(fish.baseValue, fish.quality))}</div> */}
						</div>
					);
				})}
			</div>
			<div>
				Total:
				{fish
					.map((fish) => determineValue(fish.baseValue, fish.quality))
					.filter((value) => !isNaN(value))
					.reduce((prev, cur) => prev + cur)}
				<span className='Gold-Icon Gold-Image'></span>
			</div>
		</div>
	);
}

FishingSummary.propTypes = {
  fish: PropTypes.array,
};

export default FishingSummary;
