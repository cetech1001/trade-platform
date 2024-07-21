import {Card, Nav, Pagination} from "@themesberg/react-bootstrap";
import {Dispatch, SetStateAction, useCallback} from "react";
import {PaginationOptions} from "@coinvant/types";

interface IProps {
	items: number;
	total: number;
	options: PaginationOptions;
	setOptions: Dispatch<SetStateAction<PaginationOptions>>;
}

export const TablePagination = (props: IProps) => {
	const isExhausted = useCallback(() => {
		if (props.items <= props.options.limit) {
			return true;
		}
		return props.options.page * props.options.limit === props.total;
	}, [props]);

	const onPrevClick = () => {
		if (props.options.page > 1) {
			props.setOptions(prevState => ({
				...prevState,
				page: prevState.page - 1,
			}));
		}
	}

	const onNextClick = () => {
		if (!isExhausted()) {
			props.setOptions(prevState => ({
				...prevState,
				page: prevState.page + 1,
			}));
		}
	}

	return (
		<Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
			<Nav>
				<Pagination className="mb-2 mb-lg-0">
					<Pagination.Prev disabled={props.options.page === 1} onClick={onPrevClick}>
						Previous
					</Pagination.Prev>
					<Pagination.Item active>1</Pagination.Item>
					<Pagination.Next disabled={isExhausted()} onClick={onNextClick}>
						Next
					</Pagination.Next>
				</Pagination>
			</Nav>
			<small className="fw-bold">
				Showing <b>{props.items}</b> out of <b>{props.total}</b> entries
			</small>
		</Card.Footer>
	);
}
