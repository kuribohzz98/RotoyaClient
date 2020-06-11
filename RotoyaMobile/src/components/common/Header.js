import React, { useCallback } from 'react';
// import { withNavigation } from 'react-navigation';
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Block, NavBar, Text, theme } from 'galio-framework';

import { Icon } from 'react-native-elements';
import Input from './Input';
import Tabs from './Tabs';
import argonTheme from '../../constants/Theme';
import { useDispatch } from 'react-redux';
import { ComponentAction } from './../../redux/action';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

// const BasketButton = ({isWhite, style, navigation}) => (
//   <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
//     <Icon
//       family="ArgonExtra"
//       size={16}
//       name="basket"
//       color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
//     />
//   </TouchableOpacity>
// );

const GrillButton = ({ isWhite, style, navigation }) => {
  const dispatch = useDispatch();
  const onPress = () => {
    dispatch(ComponentAction.setNameSearchSportCenters(''))
    navigation.navigate('Filter');
  }
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={() => onPress()}>
      <Icon
        type="material-community"
        size={24}
        name="view-grid"
        color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
      />
    </TouchableOpacity>
  )
}

const FilterButton = ({ isWhite, style, navigation }) => {
  const dispatch = useDispatch();
  const onPress = () => dispatch(ComponentAction.setIsVisibleFilter(true));
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={() => onPress()}>
      <Icon
        size={24}
        family="material-community"
        name="filter"
        color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
      />
    </TouchableOpacity>
  )
}

const SearchButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
    <Icon
      size={16}
      family="Galio"
      name="search-zoom-in"
      color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

const SearchInput = () => {
  const dispatch = useDispatch();
  return (
    <Input
      right
      color="black"
      style={styles.search}
      placeholder="Nhập tên trung tâm thể thao"
      placeholderTextColor={'#8898AA'}
      onChangeText={value => dispatch(ComponentAction.setNameSearchSportCentersEpic(value))}
      iconContent={<Icon size={25} color={theme.COLORS.MUTED} name="search" family="font-awesome" />}
    />
  )
}

class Header extends React.Component {
  handleLeftPress = () => {
    const { back, remove, goBack, navigation } = this.props;
    return (back || remove ? (goBack ? goBack() : navigation.goBack()) : navigation.openDrawer());
  }

  renderRight = () => {
    const { white, title, navigation, scene } = this.props;
    const { name } = scene.route;

    switch (name) {
      case 'Home':
        return ([
          <GrillButton key='grill' navigation={navigation} isWhite={white} />,
          <FilterButton key="filter" navigation={navigation} isWhite={white} />
        ]);
      // case 'Deals':
      //   return ([
      //     <BellButton key='chat-categories' navigation={navigation} />,
      //     <BasketButton key='basket-categories' navigation={navigation} />
      //   ]);
      default:
        break;
    }
  }
  // searchChange(value) {
  //   console.log(value)
  //   dispatch(ComponentAction.setNameSearchSportCenters(value))
  // }
  renderSearch = () => {
    const { navigation } = this.props;
    return (
      <SearchInput />
    );
  }
  renderOptions = () => {
    const { navigation, optionLeft, optionRight } = this.props;

    return (
      <Block row style={styles.options}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon name="diamond" family="ArgonExtra" style={{ paddingRight: 8 }} color={argonTheme.COLORS.ICON} />
            <Text size={16} style={styles.tabTitle}>{optionLeft || 'Beauty'}</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon size={16} name="bag-17" family="ArgonExtra" style={{ paddingRight: 8 }} color={argonTheme.COLORS.ICON} />
            <Text size={16} style={styles.tabTitle}>{optionRight || 'Fashion'}</Text>
          </Block>
        </Button>
      </Block>
    );
  }
  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;

    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })} />
    )
  }
  renderHeader = () => {
    const { search, options, tabs } = this.props;
    if (search || tabs || options) {
      return (
        <Block center>
          {search ? this.renderSearch() : null}
          {options ? this.renderOptions() : null}
          {tabs ? this.renderTabs() : null}
        </Block>
      );
    }
  }
  render() {
    const { back, remove, title, white, transparent, bgColor, iconColor, titleColor, navigation, scene, ...props } = this.props;
    const { name } = scene.route;
    const noShadow = ['Search', 'Categories', 'Deals', 'Pro', 'Profile'].includes(name);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];

    const navbarStyles = [
      styles.navbar,
      bgColor && { backgroundColor: bgColor }
    ];

    return (
      <Block style={headerStyles}>
        <NavBar
          title={title}
          style={navbarStyles}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          left={
            <TouchableOpacity onPress={this.handleLeftPress}>
              <Icon
                name={back ? 'chevron-left' : (remove ? 'remove' : 'th-list')}
                type="font-awesome"
                size={24}
                color={iconColor || argonTheme.COLORS.ICON} />
            </TouchableOpacity>
          }
          leftStyle={{ paddingVertical: 12, flex: 0.2 }}
          titleStyle={[
            styles.title,
            { color: argonTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor }
          ]}
          {...props}
        />
        {this.renderHeader()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  title: {
    width: '100%',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 5
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 3 : theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: argonTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: argonTheme.COLORS.HEADER
  }
});

// export default withNavigation(Header);
export default Header;
