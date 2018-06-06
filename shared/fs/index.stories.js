// @flow
import * as I from 'immutable'
import React from 'react'
import * as Types from '../constants/types/fs'
import * as Constants from '../constants/fs'
import {action, storiesOf, createPropProvider} from '../stories/storybook'
import {globalColors} from '../styles'
import Files from '.'
import ConnectedStillRow from './row/still-container'
import StillRow from './row/still'
import EditingRow from './row/editing'
import PlaceholderRow from './row/placeholder'
import UploadingRow from './row/uploading'
import {NormalPreview} from './filepreview'
import {Box} from '../common-adapters'

const folderItemStyles = {
  iconSpec: {
    type: 'basic',
    iconType: 'icon-folder-private-32',
    iconColor: globalColors.darkBlue2,
  },
  textColor: globalColors.darkBlue,
  textType: 'BodySemibold',
}

const fileItemStyles = {
  iconSpec: {
    type: 'basic',
    iconType: 'icon-file-private-32',
    iconColor: globalColors.darkBlue2,
  },
  textColor: globalColors.darkBlue,
  textType: 'Body',
}

const rowProviders = {
  Row: ({path, routePath}) => ({
    pathItemType: 'folder',
    path,
    routePath,
  }),
  ConnectedStillRow: ({path}: {path: Types.Path}) => ({
    name: Types.getPathName(path),
    onOpen: () => {},
    openInFileUI: () => {},
    type: 'folder',
    shouldShowMenu: true,
    itemStyles: folderItemStyles,
    onAction: action('onAction'),
  }),
}

const provider = createPropProvider({
  ...rowProviders,
  Footer: () => ({
    downloads: [],
  }),
  FolderHeader: () => ({
    breadcrumbItems: [
      {
        name: 'keybase',
        path: '/keybase',
      },
    ],
    dropdownItems: [],
    isTeamPath: false,
    path: Types.stringToPath('/keybase'),
    onBack: action('onBack'),
    onOpenBreadcrumb: action('onOpenBreadcrumb'),
    onOpenBreadcrumbDropdown: action('onOpenBreadcrumbDropdown'),
  }),
  SortBar: ({path}: {path: Types.Path}) => ({
    sortSetting: {
      sortBy: 'name',
      sortOrder: 'asc',
    },
    onOpenSortSettingPopup: () => {},
    folderIsPending: true,
  }),
  FilesBanner: () => ({
    path: Types.stringToPath('/keybase'),
    kbfsEnabled: true,
    showBanner: false,
    inProgress: false,
    showSecurityPrefs: false,
    getFuseStatus: action('getFuseStatus'),
    onDismiss: action('onDismiss'),
    onInstall: action('onInstall'),
    onUninstall: action('onUninstall'),
  }),
  FilePreviewDefaultView: () => ({
    fileUIEnabled: false,
    pathItem: Constants.makeFile({
      name: 'bar.jpg',
      size: 10240,
      lastWriter: {uid: '', username: 'foo'},
    }),
    itemStyles: Constants.getItemStyles(['keybase', 'private', 'foo', 'bar.jpg'], 'file', 'foo'),
    onDownload: () => {},
    onShowInFileUI: () => {},
    onShare: () => {},
    onSave: () => {},
  }),
  FilePreviewHeader: () => ({
    pathItem: Constants.makeFile({
      name: 'bar.jpg',
      size: 10240,
      lastWriter: {uid: '', username: 'foo'},
    }),
    onAction: () => {},
    onBack: () => {},
    onShowInFileUI: () => {},
    loadFilePreview: () => {},
    path: '/keybase/private/foo/bar.jpg',
  }),
  ViewContainer: () => ({
    url: '/keybase/private/foo/bar.jpg',
    mimeType: 'jpg',
    isSymlink: false,
    path: '/keybase/private/foo/bar.jpg',
    onInvalidToken: action('onInvalidToken'),
    loadMimeType: action('loadMimeType'),
  }),
})

const commonRowProps = {
  onSubmit: action('onSubmit'),
  onUpdate: action('onUpdate'),
  onCancel: action('onCancel'),
}

const load = () => {
  storiesOf('Files', module)
    .addDecorator(provider)
    .add('Root', () => (
      <Files
        path={Types.stringToPath('/keybase')}
        progress="loaded"
        routePath={I.List([])}
        stillItems={[
          Types.stringToPath('/keybase/private'),
          Types.stringToPath('/keybase/public'),
          Types.stringToPath('/keybase/team'),
        ]}
        editingItems={[]}
      />
    ))
    .add('Preview', () => (
      <NormalPreview
        routePath={I.List([])}
        routeProps={I.Map({
          path: '/keybase/private/foo/bar.jpg',
        })}
      />
    ))
    .add('Rows', () => (
      <Box>
        <ConnectedStillRow
          path={Types.stringToPath('/keybase/private/a')}
          routeProps={I.Map({path: '/keybase/private/foo'})}
          routePath={I.List([])}
        />
        <EditingRow
          name="New Folder (editing)"
          hint="New Folder (editing)"
          status="editing"
          itemStyles={folderItemStyles}
          isCreate={true}
          {...commonRowProps}
        />
        <EditingRow
          name="From Dropbox (rename) (editing)"
          hint="From Dropbox (rename) (editing)"
          status="editing"
          itemStyles={folderItemStyles}
          isCreate={false}
          {...commonRowProps}
        />
        <EditingRow
          name="New Folder (saving)"
          hint="New Folder (saving)"
          status="saving"
          itemStyles={folderItemStyles}
          isCreate={true}
          {...commonRowProps}
        />
        <EditingRow
          name="New Folder (failed)"
          hint="New Folder (failed)"
          status="failed"
          itemStyles={folderItemStyles}
          isCreate={true}
          {...commonRowProps}
        />
        <UploadingRow name="foo" itemStyles={fileItemStyles} />
        <UploadingRow name="foo" itemStyles={folderItemStyles} />
        <StillRow
          name="bar"
          type="file"
          lastModifiedTimestamp={Date.now()}
          lastWriter="alice"
          shouldShowMenu={true}
          itemStyles={fileItemStyles}
          badgeCount={0}
          isDownloading={true}
          isUserReset={false}
          resetParticipants={[]}
          onOpen={action('onOpen')}
          openInFileUI={action('openInFileUI')}
          onAction={action('onAction')}
        />
        <PlaceholderRow />
      </Box>
    ))
}

export default load
