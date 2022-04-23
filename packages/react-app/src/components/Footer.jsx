import classNames from 'classnames'
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/images/icons/logo.svg';
import { useGlobalStyles } from '../../styles'
import { useStyles } from './styles'
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { makeStyles } from '@mui/styles'
import circlePattern from '../../assets/images/icons/bg-pattern-circle.svg';

const Footer = () => {
    const classes = useStyles();
    const globalStyles = useGlobalStyles();

    return (
      <footer
        className={classNames(
          "flex flex-col items-center bg-no-repeat pt-8 pb-12",
          classes.footer,
          globalStyles.px,
          "sm:flex-row sm:justify-between sm:pb-8"
        )}
      >
        <div className={classNames("flex flex-col items-center sm:flex-row")}>
          <h1 className="text-3xl font-extrabold text-gray-400">School Voting</h1>
          <ul
            className={classNames(
              "flex flex-col items-center mt-8 sm:mt-0 sm:ml-8 sm:flex-row"
            )}
          >
           
          </ul>
        </div>
        <ul
          className={classNames("flex items-center mt-8 sm:mt-0 sm:flex-row")}
        >
          <FacebookIcon
            className={classNames(
              "text-white hover:pointer mr-4",
              globalStyles.darkPinkButton
            )}
          />
          <TwitterIcon
            className={classNames(
              "text-white hover:pointer mr-4",
              globalStyles.darkPinkButton
            )}
          />
          <LinkedInIcon
            className={classNames(
              "text-white hover:pointer",
              globalStyles.darkPinkButton
            )}
          />
        </ul>
      </footer>
    );
};

export default Footer;
export const useStyles = makeStyles(theme => ({//
    footer: {
        backgroundColor: '#1B262F',
        backgroundImage: `url(${circlePattern})`,
        backgroundPosition: 'center bottom -227px',
        backgroundSize: 400,
        position:'relative',
        [theme.breakpoints.up(420)]: {
            backgroundPosition: 'center bottom -324px',
            backgroundSize: 500,
        },
        [theme.breakpoints.up(490)]: {
            backgroundPosition: 'center bottom -524px',
            backgroundSize: 700,
        },
        [theme.breakpoints.up('sm')]: {
            backgroundPosition: 'right -183px bottom -217px',
            backgroundSize: 400,
        },
        [theme.breakpoints.up(1200)]: {
            backgroundPosition: 'right -134px bottom -240px',
        }
    }
}))