import {ForexPair} from "@coinvant/types";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";

interface IProps {
	assets: ForexPair[];
}

export const ForexPairs = (props: IProps) => {
	const [pairs, setPairs] = useState<(ForexPair & { isActive: boolean })[]>([]);

	useEffect(() => {
		setPairs(props.assets.map(asset => ({
			...asset,
			isActive: false,
		})));
	}, [props.assets]);

	const onClick = (id: string) => {
		const items = pairs.map(asset => {
			if (asset.isActive) {
				return { ...asset, isActive: false };
			}
			return asset;
		});
		setPairs(items.map(asset => {
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
				<span className={'name-price'}>Name</span>
				<span className={'change'}>Code</span>
			</div>
			<div>
				{pairs.map((asset) => (
					<div className={`asset-item ${asset.isActive && 'asset-active'}`} onClick={() => onClick(asset.id)}>
						<div className="flag">
							{/*<img src={asset.flag} alt={`${asset.name} flag`}/>*/}
						</div>
						<span className={'name-price'}>
							<span className="name">
								{`${asset.base}/${asset.term}`}
							 </span>
							<span className="price">{0}</span>
						</span>
						<span className={'change'}>
							<span className={'positive'}>+2.0</span>
							<Link to={'#'}>
								<i className="fa-solid fa-circle-info info"></i>
							</Link>
						</span>
					</div>
				))}
			</div>
		</>
	)
}
