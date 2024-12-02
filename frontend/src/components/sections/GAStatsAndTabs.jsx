// src/components/ProfileDetailsSection.jsx

import React from "react";

const ProfileDetailsSection = () => {
  return (
    <section>
      <div className="flex justify-end">
        <button className="btn btn-wide bg-blue-500 hover:bg-blue-600 text-white mr-8 mt-4">
          Follow
        </button>
      </div>

      <div className="mt-6 px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Wrapper div for User Info and Stats */}
          <div className="flex flex-col lg:w-1/4">
            {/* User Info Section */}
            <div className="mb-8 ml-6">
              <div className="text-3xl font-bold">Kusala Sameera</div>
              <div className="text-lg text-gray-500">@samsam</div>
              <div className="mt-2">
                We can show for users guides you are follwoing and agencies you
                are follwoing here and liked posts number maybe? For
                Agencies?Guides it will stay the same. We can add more fields
                like what type of tourism they specialise in and other data we
                collect during signup. MUST ENSURE PAGINATION EVERYWHERE IN THE
                TABS FIELDS.
              </div>
            </div>

            {/* Stats Section */}
            <div className="stats stats-horizontal shadow">
              <div className="stat">
                <div className="stat-value">50</div>
                <div className="stat-title">Posts</div>
              </div>
              <div className="stat">
                <div className="stat-value">31K</div>
                <div className="stat-title">Followers</div>
              </div>
              <div className="stat">
                <div className="stat-value">4,200</div>
                <div className="stat-title">Following</div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="w-full lg:w-3/4">
            <div role="tablist" className="tabs tabs-bordered">
              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab"
                aria-label="Packages"
              />
              <div role="tabpanel" className="tab-content p-10">
                All the packages posted by the agency will appear here. This is
                only for the customers when they click view profile of an
                agency.
              </div>
              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab"
                aria-label="Posts"
              />
              <div role="tabpanel" className="tab-content p-10 mr-32">
                All the guide/agency posts will apear here. This is common for
                guide/agency/customer. But for guide and agency they will see
                their own posts and for customer they will see the posts of the
                guide/agency profile they are checking out.
              </div>

              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab"
                aria-label="Feed"
                defaultChecked
              />
              <div role="tabpanel" className="tab-content p-10">
                All the posts from whoever they follow will be here. This is
                common for guide/agency/customer.
              </div>

              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab"
                aria-label="Comments"
              />
              <div role="tabpanel" className="tab-content p-10">
                Comments they made will appear here. his is common for
                guide/agency/customer.
              </div>

              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab"
                aria-label="Liked Posts"
              />
              <div role="tabpanel" className="tab-content p-10">
                All the posts that they liked will be showed here. his is common
                for guide/agency/customer.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileDetailsSection;
