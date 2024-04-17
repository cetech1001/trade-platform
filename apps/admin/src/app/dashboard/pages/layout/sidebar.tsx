import React, {FC, useState} from "react";
import SimpleBar from 'simplebar-react';
import { useLocation, Link } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { Nav, Badge, Image, Button, Accordion, Navbar } from '@themesberg/react-bootstrap';
import {Color} from "@themesberg/react-bootstrap/lib/cjs/types";
import ProfilePicture from "../../../../assets/images/profile-picture.jpg";
import {AdminRoutes} from "../../../../routes";

interface CollapsableNavItemProps {
  eventKey: string;
  title: string;
  icon: string;
  children: React.JSX.Element[];
}

interface NavItemProps {
  title: string;
  link: string;
  icon?: string;
  badgeText?: string;
  badgeBg?: string;
  badgeColor?: Color | undefined;
}

export const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem: FC<CollapsableNavItemProps> = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon"><i className={`fa-solid fa-${icon}`}/> </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem: FC<NavItemProps> = (props) => {
    const classNames = props.badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
    const navItemClassName = props.link === pathname ? "active" : "";

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link as={Link} to={props.link} className={classNames}>
          <span>
            {props.icon ? (
              <span className="sidebar-icon">
                <i className={`fa-solid fa-${props.icon}`}/>
              </span>
            ) : null}
            <span className="sidebar-text">{props.title}</span>
          </span>
          {props.badgeText ? (
            <Badge pill bg={props.badgeBg || 'secondary'} text={props.badgeColor || 'primary'}
                   className="badge-md notification-count ms-2">{props.badgeText}</Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand className="me-lg-5" as={Link} to={'/dashboard'} style={{ color: "#FFFFFF" }}>
          <svg width="28" height="30" viewBox="0 0 14 15">
            <g transform="translate(2 8.25)">
              <path fill="#1FBF75"
                    d="m4.8828.6523-3.948 5.108c-.075.098-.006.24.118.24h7.894c.124 0 .194-.142.119-.24L5.1168.6523c-.059-.077-.174-.077-.234 0"></path>
            </g>
            <g transform="translate(0 -.75)">
              <path fill="currentColor"
                    d="m2.7324 13.0918 1.954-2.561c.046-.059.036-.142-.02-.193-.9-.81-1.391-2.063-1.066-3.433.298-1.257 1.32-2.277 2.581-2.563 2.289-.518 4.319 1.208 4.319 3.408 0 1.031-.456 1.948-1.166 2.588-.057.051-.067.134-.021.194l1.954 2.56c.052.068.153.081.219.025 1.481-1.238 2.444-3.076 2.51-5.142.122-3.835-3.044-7.162-6.88-7.224-3.919-.063-7.116 3.094-7.116 6.999 0 2.157.978 4.084 2.513 5.367.066.056.167.043.219-.025"></path>
            </g>
          </svg>
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon"/>
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
          <div className="sidebar-inner px-4 pt-3">
            <div
              className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image src={ProfilePicture} className="card-img-top rounded-circle border-white"/>
                </div>
                <div className="d-block">
                  <h6>Hi, Admin</h6>
                  <Button variant="secondary" className="text-dark">
                    <i className="fa-solid fa-right-from-bracket me-2" /> Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                <i className={"fa-solid fa-xmark"}/>
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <NavItem title="Overview" link={AdminRoutes.overview} icon={'chart-pie'} />
              <NavItem title="Users" link={AdminRoutes.users} icon={'users'}/>
              <CollapsableNavItem eventKey="trades/" title="Trades" icon={'chart-line'}>
                <NavItem title="Pending" link={`${AdminRoutes.trades}/?status=pending`}/>
                <NavItem title="Active" link={`${AdminRoutes.trades}/?status=active`}/>
                <NavItem title="Completed" link={`${AdminRoutes.trades}/?status=completed`}/>
                <NavItem title="Cancelled" link={`${AdminRoutes.trades}/?status=cancelled`}/>
              </CollapsableNavItem>
              <CollapsableNavItem eventKey="deposits/" title="Deposits" icon={'wallet'}>
                <NavItem title="Pending" link={`${AdminRoutes.deposits}/?status=pending`}/>
                <NavItem title="Approved" link={`${AdminRoutes.deposits}/?status=approved`}/>
                <NavItem title="Cancelled" link={`${AdminRoutes.deposits}/?status=cancelled`}/>
                <NavItem title="Refunded" link={`${AdminRoutes.deposits}/?status=refunded`}/>
              </CollapsableNavItem>
              <CollapsableNavItem eventKey="withdrawals/" title="Withdrawals" icon={'money-bill'}>
                <NavItem title="Pending" link={`${AdminRoutes.withdrawals}/?status=pending`}/>
                <NavItem title="Paid" link={`${AdminRoutes.withdrawals}/?status=paid`}/>
                <NavItem title="Cancelled" link={`${AdminRoutes.withdrawals}/?status=cancelled`}/>
              </CollapsableNavItem>
              <Button variant="secondary" className="upgrade-to-pro">
                <i className="fa-solid fa-right-from-bracket me-1" /> Logout
              </Button>
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
