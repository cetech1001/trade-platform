import { Nav, Image, Navbar, Dropdown, Container } from '@themesberg/react-bootstrap';
import Profile3 from "../../../assets/images/admin-img.png";
import {connect} from "react-redux";
import {logout, RootState} from "@coinvant/store";
import {useNavigate} from "react-router-dom";
import {AdminRoutes} from "../../routes";
import {AuthUser} from "@coinvant/types";

interface IProps {
  user: Omit<AuthUser, 'password'> | null;
  logout: () => void;
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const actions = { logout };

export const TopNav = connect(mapStateToProps, actions)((props: IProps) => {
  const navigateTo = useNavigate();

  const handleLogout = () => {
    props.logout();
    navigateTo('/');
  }

  return (
      <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
        <Container fluid className="px-0">
          <div className="d-flex justify-content-end w-100">
            <Nav className="align-items-center">
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                  <div className="media d-flex align-items-center">
                    <Image src={Profile3} className="user-avatar md-avatar rounded-circle" style={{ height: "15px" }} />
                    <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                      <span className="mb-0 font-small fw-bold">{props.user?.name}</span>
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                  <Dropdown.Item className="fw-bold"
                                 onClick={() => navigateTo(`/${AdminRoutes.profile}`)}>
                    <i className="fa-solid fa-user me-2" /> My Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="fw-bold" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket text-danger me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </div>
        </Container>
      </Navbar>
  );
});
