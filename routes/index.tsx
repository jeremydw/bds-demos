export function Page() {
  return (
    <>
      {/* Custom elements are intelligently collected by Root.js. */}
      <bds-audio-player
        title="Podcast title"
        subtitle="Podcast subtitle"
        src="https://www.google.com/googleblogs/images/cadie/sunday_panda.mp3"
      ></bds-audio-player>
    </>
  );
}

export default Page;
