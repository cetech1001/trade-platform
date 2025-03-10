import {Card, Nav, Pagination} from "@themesberg/react-bootstrap";
import { Dispatch, SetStateAction, useCallback } from 'react';
import {PaginationOptions} from "@coinvant/types";

interface IProps {
	itemsCount: number;
	totalItemsCount: number;
  totalPages: number;
	options: PaginationOptions;
	setOptions: Dispatch<SetStateAction<PaginationOptions>>;
}

export const TablePagination = (props: IProps) => {
  const isExhausted = useCallback(() => {
		if ((props.options.limit * props.options.page) >= props.totalItemsCount) {
			return true;
		}
		return props.options.page * props.options.limit === props.totalItemsCount;
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

  const navigateToPage = (page: number) => {
    return () => {
      props.setOptions(prevState => ({
        ...prevState,
        page,
      }));
    }
  }

	return (
		<Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
			<Nav>
				<Pagination className="mb-2 mb-lg-0 gap-2">
					<Pagination.Prev disabled={props.options.page === 1} onClick={onPrevClick}>
						Previous
					</Pagination.Prev>
          {Array.from(Array(props.totalPages)).map((_, i) => (
            <Pagination.Item key={i} onClick={navigateToPage(i + 1)}
                             active={props.options.page === i + 1}>
              {i + 1}
            </Pagination.Item>
          ))}
					<Pagination.Next disabled={isExhausted()} onClick={onNextClick}>
						Next
					</Pagination.Next>
				</Pagination>
			</Nav>
			<small className="fw-bold">
				Showing <b>{props.itemsCount + ((props.options.page - 1) * props.options.limit)}</b> out of <b>{props.totalItemsCount}</b> entries
			</small>
		</Card.Footer>
	);
}
