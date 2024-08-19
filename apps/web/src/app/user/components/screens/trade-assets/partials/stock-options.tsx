import {StockOption} from "@coinvant/types";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {wrapWord} from "../../../../../helpers";

interface IProps {
	assets: StockOption[];
}

export const StockOptions = (props: IProps) => {
	const [options, setOptions] = useState<(StockOption & { isActive: boolean })[]>([]);

	useEffect(() => {
		setOptions(props.assets.map(asset => ({
			...asset,
			isActive: false,
		})));
	}, [props.assets]);

	const onClick = (id: string) => {
		const items = options.map(asset => {
			if (asset.isActive) {
				return { ...asset, isActive: false };
			}
			return asset;
		});
		setOptions(items.map(asset => {
			if (asset.id === id) {
				return { ...asset, isActive: true };
			}
			return asset;
		}));
	}

	return (
		<>
			<div className={'table-header'}>
				<div className={'flag'}>Symbol</div>
				<span className={'name-price'}>Name, Asset Type</span>
				<span className={'change'}>Exchange</span>
			</div>
			<div>
				{options.map((asset) => (
					<div className={`asset-item ${asset.isActive && 'asset-active'}`} key={asset.id}
					     onClick={() => onClick(asset.id)}>
						<div className="flag">
							{asset.symbol}
						</div>
						<span className={'name-price'}>
							<span className="name">{wrapWord(asset.name)}</span>
							<span className="price">{asset.assetType}</span>
						</span>
						<span className={'change'}>
							<span>{asset.exchange}</span>
						</span>
					</div>
				))}
			</div>
		</>
	)
}
