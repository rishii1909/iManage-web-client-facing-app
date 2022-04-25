import UnauthorizedLayer from "../components/UnauthorizedLayer";

const AboutPage = () => {
  return (
    <UnauthorizedLayer>
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          gridGap: "48px",
          justifyContent: "center",
          padding: "32px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "545px",
          }}
        >
          <h1
            style={{
              fontWeight: "900",
              margin: "0px",
            }}
          >
            About Us
          </h1>

          <p
            style={{
              fontWeight: "300",
              fontSize: "15px",
              opacity: "0.6",
              width: "100%",
              textAlign: "justify",
            }}
          >
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
            est et expedita distinctio. Nam libero tempore, cum soluta nobis est
            eligendi optio cumque nihil impedit quo minus id quod maxime placeat
            facere possimus, omnis voluptas assumenda est, omnis dolor
            repellendus. Temporibus autem quibusdam et aut officiis debitis aut
            rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint
            et molestiae non recusandae. Itaque earum rerum hic tenetur a
            sapiente delectus, ut aut reiciendis voluptatibus maiores alias
            consequatur aut perferendis doloribus asperiores repellat.
          </p>
        </div>

        <img
          style={{
            borderRadius: "24px",
            width: "100%",
            maxWidth: "545px",
          }}
          src={"/assets/about-us.jpg"}
        />
      </div>
    </UnauthorizedLayer>
  );
};

export default AboutPage;
