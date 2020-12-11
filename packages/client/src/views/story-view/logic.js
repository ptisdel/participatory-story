import _ from 'lodash-es';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import * as helpers from '../../helpers';
import * as entities from '../../entities';

const { useAuthentication } = helpers;
const { join, useStory } = entities.story.api;
const { useEntries } = entities.entry.api;

export const useStoryView = () => {
  const { storyId } = useParams();

  // fetch story and entries
  const { isLoading: isStoryLoading, story } = useStory({ storyId });
  const { isLoading: isEntriesLoading, entries } = useEntries({ storyId });

  // get notification settings
  const [isSubscribedToNotifications, setIsSubscribedToNotifications] = useState(false);
  const { user } = useAuthentication();

  // join story
  const [joinStory, { isLoading }] = useMutation(join, {
    onError: () => console.log('Oops!'),
    onSuccess: () => console.log('Joined story!'),
  });

  const onJoinStory = () => {
    joinStory({
      storyId,
    });
  };

  return [{
    isLoading: isStoryLoading || isEntriesLoading,
    isSubscribedToNotifications,
    entries,
    storyName: story?.name,
    userId: user?.id,
    userIsAuthor: story?.userIsAuthor,
    userIsPlayer: story?.userIsPlayer,
  }, {
    onJoinStory,
  }];
}
