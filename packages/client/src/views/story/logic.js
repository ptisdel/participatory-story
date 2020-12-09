import _ from 'lodash-es';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import * as helpers from '../../helpers';
import * as entities from '../../entities';

const { useAuthentication } = helpers;
const { useStory } = entities.story.api;

export const useStoryView = () => {
  const { storyId } = useParams();

  // fetch story
  const { isLoading, story } = useStory({ storyId });

  // get notification settings
  const [isSubscribedToNotifications, setIsSubscribedToNotifications] = useState(false);
  const { user } = useAuthentication();

  return [{
    isLoading,
    isSubscribedToNotifications,
    sections: story?.sections,
    storyAuthorId: story?.authorId,
    userId: user?.userId,
  }, {
  }];
}
